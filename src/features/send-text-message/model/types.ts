import type { WebSocketMessageType } from "@/entities/message";

export type MessageDto = {
  type: WebSocketMessageType;
  chatId: number;
  content: string;
  contentType: "TEXT";
};

export type SendMessageResult = "sent" | "empty" | "unavailable";
