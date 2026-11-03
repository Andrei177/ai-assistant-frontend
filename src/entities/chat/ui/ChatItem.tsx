import type { ReactNode } from "react";
import type { Chat } from "../model/types";

type ChatItemProps = {
  chat: Chat;
  isSelected?: boolean;
  onSelect?: () => void;
  actions?: ReactNode;
};

export const ChatItem = ({
  chat,
  isSelected = false,
  onSelect,
  actions,
}: ChatItemProps) => {
  return (
    <li
      className={`flex min-w-0 items-center gap-1 rounded-xl px-2 py-1 transition-colors ${
        isSelected ? "bg-muted" : "hover:bg-muted/70"
      }`}
    >
      <button
        type="button"
        className="min-w-0 flex-1 cursor-pointer truncate px-1 py-1.5 text-left text-sm font-medium"
        title={chat.chatName}
        aria-current={isSelected ? "true" : undefined}
        onClick={onSelect}
      >
        {chat.chatName}
      </button>
      {actions}
    </li>
  );
};
