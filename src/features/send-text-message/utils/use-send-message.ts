import type { Chat } from "@/entities/chat";
import type { WebSocketMessageType } from "@/entities/message";
import { useCallback, type RefObject } from "react";

type Args = {
  wsRef: RefObject<WebSocket | null>;
  selectedChat: Chat | null;
  messageType: WebSocketMessageType;
};

export const useSendMessage = ({ wsRef, selectedChat, messageType }: Args) => {
  return useCallback(
    (data: string) => {
      if (
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN &&
        selectedChat?.chatId &&
        data.length > 0
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: messageType,
            chatId: selectedChat.chatId,
            content: data,
            contentType: "TEXT",
          }),
        );
      }
    },
    [selectedChat, wsRef, messageType],
  );
};
