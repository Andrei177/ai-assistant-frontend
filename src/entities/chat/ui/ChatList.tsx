import type { ReactNode } from "react";
import { useChats } from "../utils/chat-hooks";
import type { Chat } from "../model/types";
import { ChatItem } from "./ChatItem";

type ChatListProps = {
  selectedChatId: number | null;
  onSelectChat: (chat: Chat) => void;
  renderActions: (chat: Chat) => ReactNode;
  createAction: () => ReactNode;
};

export const ChatList = ({
  selectedChatId,
  onSelectChat,
  renderActions,
  createAction,
}: ChatListProps) => {
  const { data, isPending, isError, error } = useChats();

  return (
    <section
      aria-labelledby="chat-list-title"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
    >
      <header className="border-b px-4 py-4 flex text-center justify-between">
        <h2 id="chat-list-title" className="font-semibold">
          Ваши чаты
        </h2>
        {createAction()}
      </header>

      {isPending && (
        <p role="status" className="p-4 text-sm text-muted-foreground">
          Загружаем чаты...
        </p>
      )}

      {isError && (
        <p role="alert" className="p-4 text-sm text-destructive">
          Не удалось загрузить чаты:{" "}
          {error instanceof Error ? error.message : "неизвестная ошибка"}
        </p>
      )}

      {data &&
        (data.content.length > 0 ? (
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
            {data.content.map((chat) => (
              <ChatItem
                key={chat.chatId}
                chat={chat}
                isSelected={chat.chatId === selectedChatId}
                onSelect={() => onSelectChat(chat)}
                actions={renderActions(chat)}
              />
            ))}
          </ul>
        ) : (
          <p role="status" className="p-4 text-sm text-muted-foreground">
            Пока нет чатов
          </p>
        ))}
    </section>
  );
};
