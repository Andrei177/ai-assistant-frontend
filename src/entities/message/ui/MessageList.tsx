import { useCallback, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/shared";
import type { MessagePageParams } from "../model/types";
import { useInfiniteMessagesByChatId } from "../utils/message-hooks";
import { Message } from "./Message";

type MessageListProps = {
  chatId: number;
  params?: MessagePageParams;
  renderTranslation?: (messageId: number) => ReactNode;
};

export const MessageList = ({
  chatId,
  params,
  renderTranslation,
}: MessageListProps) => {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteMessagesByChatId(chatId, params);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousChatIdRef = useRef(chatId);
  const previousPageCountRef = useRef(0);
  const scrollAnchorRef = useRef<{ height: number; top: number } | null>(null);

  const handleScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (
      !scrollContainer ||
      scrollContainer.scrollTop > 48 ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }

    scrollAnchorRef.current = {
      height: scrollContainer.scrollHeight,
      top: scrollContainer.scrollTop,
    };
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const pageCount = data?.pages.length ?? 0;
    const chatChanged = previousChatIdRef.current !== chatId;
    const loadedOlderPage = pageCount > previousPageCountRef.current;

    if (chatChanged) {
      previousChatIdRef.current = chatId;
      previousPageCountRef.current = 0;
      scrollAnchorRef.current = null;
    }

    if (data && loadedOlderPage && scrollAnchorRef.current) {
      const { height, top } = scrollAnchorRef.current;
      scrollContainer.scrollTop = top + scrollContainer.scrollHeight - height;
      scrollAnchorRef.current = null;
    } else if (data && (chatChanged || loadedOlderPage || pageCount > 0)) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    previousPageCountRef.current = pageCount;
  }, [chatId, data]);

  const messages = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="h-full min-h-0 overflow-y-auto"
    >
      {isPending && (
        <p
          role="status"
          className="flex min-h-full items-center justify-center p-4 text-sm text-muted-foreground"
        >
          Загружаем сообщения...
        </p>
      )}

      {isError && !data && (
        <p
          role="alert"
          className="flex min-h-full items-center justify-center p-4 text-sm text-destructive"
        >
          Не удалось загрузить сообщения:{" "}
          {error instanceof Error ? error.message : "неизвестная ошибка"}
        </p>
      )}

      {data && messages.length === 0 && (
        <p
          role="status"
          className="flex min-h-full items-center justify-center p-4 text-center text-sm text-muted-foreground"
        >
          Пока нет сообщений
        </p>
      )}

      {isFetchNextPageError && (
        <div className="flex items-center gap-3 px-4 pt-4">
          <p role="alert" className="text-sm text-destructive">
            Не удалось загрузить старые сообщения.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            Повторить
          </Button>
        </div>
      )}

      {isFetchingNextPage && (
        <p role="status" className="px-4 pt-4 text-sm text-muted-foreground">
          Загружаем старые сообщения...
        </p>
      )}

      {data && messages.length > 0 && (
        <ul
          aria-label="Сообщения чата"
          className="flex min-h-full flex-col gap-3 p-4"
        >
          {[...messages].reverse().map((message) => (
            <Message
              key={message.messageId}
              message={message}
              translation={
                message.contentType === "TEXT" &&
                !message.isStreaming &&
                typeof message.messageId === "number"
                  ? renderTranslation?.(message.messageId)
                  : undefined
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
};
