import type { Chat } from "@/entities/chat";
import type { WebSocketMessageType } from "@/entities/message";
import { useCallback, type RefObject } from "react";
import type { MessageDto, SendMessageResult } from "../model/types";

type Args = {
  wsRef: RefObject<WebSocket | null>;
  selectedChat: Chat | null;
  messageType: WebSocketMessageType;
};

export const useSendMessage = ({ wsRef, selectedChat, messageType }: Args) => {
  return useCallback(
    (content: string): SendMessageResult => {
      if (content.length === 0) return "empty";

      const ws = wsRef.current;
      if (
        !ws ||
        ws.readyState !== WebSocket.OPEN ||
        !selectedChat?.chatId
      ) {
        return "unavailable";
      }

      const message: MessageDto = {
        type: messageType,
        chatId: selectedChat.chatId,
        content,
        contentType: "TEXT",
      };

      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "InvalidStateError"
        ) {
          return "unavailable";
        }
        throw error;
      }

      return "sent";
    },
    [selectedChat, wsRef, messageType],
  );
};
