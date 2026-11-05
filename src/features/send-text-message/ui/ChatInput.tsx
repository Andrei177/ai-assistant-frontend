import { Button, Input } from "@/shared";
import { Send } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type RefObject } from "react";
import { useSendMessage } from "../utils/use-send-message";
import type { Chat } from "@/entities/chat";
import { WebSocketMessageTypes } from "@/entities/message";

type Props = {
  wsRef: RefObject<WebSocket | null>;
  selectedChat: Chat | null;
};

export const ChatInput = ({ wsRef, selectedChat }: Props) => {
  const [textMessage, setTextMessage] = useState("");

  const sendMessage = useSendMessage({
    wsRef,
    selectedChat,
    messageType: WebSocketMessageTypes.SEND_MESSAGE,
  });

  const handleClick = () => {
    sendMessage(textMessage);
    setTextMessage("");
  };

  return (
    <div className="flex text-center">
      <Input
        aria-label="Элемент для ввода сообщения"
        placeholder="Текст сообщения"
        value={textMessage}
        disabled={!selectedChat?.chatId}
        onChange={(e) => setTextMessage(e.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={!selectedChat?.chatId}
        className="cursor-pointer"
        aria-label="Отправить сообщение"
        onClick={handleClick}
      >
        <HugeiconsIcon icon={Send} aria-hidden="true" />
      </Button>
    </div>
  );
};
