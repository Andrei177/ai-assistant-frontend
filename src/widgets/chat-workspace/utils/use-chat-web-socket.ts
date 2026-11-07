import { useEffect, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import {
  messageKeys,
  updateLatestMessagePage,
  WebSocketMessageTypes,
} from "@/entities/message";
import type {
  MessagePage,
  MessageType,
  WebSocketMessageType,
} from "@/entities/message";
import { useAuthStore } from "@/features/auth";
import { messageParams } from "./message-params";

type ChatWebSocketEvent = {
  type: WebSocketMessageType;
  chatId?: number;
  message?: MessageType;
  token?: string;
};

export const useChatWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080/ws/chats");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: WebSocketMessageTypes.AUTH,
          accessToken: token,
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as ChatWebSocketEvent;
      const chatId = data.chatId ?? data.message?.chatId;

      if (!chatId) return;

      const targetQueryKey = messageKeys.infiniteList(chatId, messageParams);

      if (data.type === WebSocketMessageTypes.MESSAGE_ACCEPTED) {
        const acceptedMessage = data.message;
        if (!acceptedMessage) return;

        queryClient.setQueryData(
          targetQueryKey,
          (old: InfiniteData<MessagePage> | undefined) =>
            updateLatestMessagePage(old, (page) => {
              const messages = page.content.filter(
                (message) =>
                  message.messageId !== acceptedMessage.messageId &&
                  !(
                    acceptedMessage.contentType === "VOICE" &&
                    message.contentType === "VOICE" &&
                    message.isSending
                  ),
              );

              return {
                ...page,
                content: [acceptedMessage, ...messages],
              };
            }),
        );
      }

      if (data.type === WebSocketMessageTypes.MESSAGE_STREAM) {
        queryClient.setQueryData(
          targetQueryKey,
          (old: InfiniteData<MessagePage> | undefined) =>
            updateLatestMessagePage(old, (page) => {
              const firstMessage = page.content[0];

              if (
                firstMessage &&
                firstMessage.isStreaming &&
                firstMessage.messageId === `stream-${chatId}`
              ) {
                return {
                  ...page,
                  content: [
                    {
                      ...firstMessage,
                      content: firstMessage.content + (data.token ?? ""),
                    },
                    ...page.content.slice(1),
                  ],
                };
              }

              const streamingMessage: MessageType = {
                messageId: `stream-${chatId}`,
                content: data.token ?? "",
                contentType: "TEXT",
                audioUrl: null,
                role: "ASSISTANT",
                transcription: null,
                createdAt: new Date().toISOString(),
                chatId,
                isStreaming: true,
              };

              return {
                ...page,
                content: [streamingMessage, ...page.content],
              };
            }),
        );
      }

      if (data.type === WebSocketMessageTypes.MESSAGE_STREAM_COMPLETED) {
        const completedMessage = data.message;
        if (!completedMessage) return;

        queryClient.setQueryData(
          targetQueryKey,
          (old: InfiniteData<MessagePage> | undefined) =>
            updateLatestMessagePage(old, (page) => ({
              ...page,
              content: [
                completedMessage,
                ...page.content.filter(
                  (message) => message.messageId !== `stream-${chatId}`,
                ),
              ],
            })),
        );
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [token, queryClient]);

  return wsRef;
};
