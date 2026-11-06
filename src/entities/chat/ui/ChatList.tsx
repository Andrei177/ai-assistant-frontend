import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/shared";
import { useInfiniteChats } from "../utils/chat-hooks";
import type { Chat } from "../model/types";
import { ChatItem } from "./ChatItem";

const chatPageParams = { size: 20 } as const;

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
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteChats(chatPageParams);
  const chatListRef = useRef<HTMLUListElement>(null);
  const chats = data?.pages.flatMap((page) => page.content) ?? [];

  const handleScroll = useCallback(() => {
    const chatList = chatListRef.current;
    if (
      !chatList ||
      chatList.scrollHeight - chatList.scrollTop - chatList.clientHeight > 48 ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  useEffect(() => {
    handleScroll();
  }, [chats.length, handleScroll]);

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

      {isError && !data && (
        <p role="alert" className="p-4 text-sm text-destructive">
          Не удалось загрузить чаты:{" "}
          {error instanceof Error ? error.message : "неизвестная ошибка"}
        </p>
      )}

      {data &&
        (chats.length > 0 ? (
          <ul
            ref={chatListRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2"
          >
            {chats.map((chat) => (
              <ChatItem
                key={chat.chatId}
                chat={chat}
                isSelected={chat.chatId === selectedChatId}
                onSelect={() => onSelectChat(chat)}
                actions={renderActions(chat)}
              />
            ))}
            {isFetchNextPageError && (
              <li className="grid gap-2 p-2">
                <p role="alert" className="text-sm text-destructive">
                  Не удалось загрузить остальные чаты.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void fetchNextPage()}
                >
                  Повторить
                </Button>
              </li>
            )}
            {isFetchingNextPage && (
              <li role="status" className="p-2 text-sm text-muted-foreground">
                Загружаем чаты...
              </li>
            )}
          </ul>
        ) : (
          <p role="status" className="p-4 text-sm text-muted-foreground">
            Пока нет чатов
          </p>
        ))}
    </section>
  );
};
