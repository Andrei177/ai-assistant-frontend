import type { MessagePageParams } from "../model/types";
import { useMessagesByChatId } from "../utils/message-hooks";
import { Message } from "./Message";

type MessageListProps = {
  chatId: number;
  params?: MessagePageParams;
};

export const MessageList = ({ chatId, params }: MessageListProps) => {
  const { data, isPending, isError, error } = useMessagesByChatId(
    chatId,
    params,
  );

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      {isPending && (
        <p
          role="status"
          className="flex min-h-full items-center justify-center p-4 text-sm text-muted-foreground"
        >
          Загружаем сообщения...
        </p>
      )}

      {isError && (
        <p
          role="alert"
          className="flex min-h-full items-center justify-center p-4 text-sm text-destructive"
        >
          Не удалось загрузить сообщения:{" "}
          {error instanceof Error ? error.message : "неизвестная ошибка"}
        </p>
      )}

      {data && data.content.length === 0 && (
        <p
          role="status"
          className="flex min-h-full items-center justify-center p-4 text-center text-sm text-muted-foreground"
        >
          Пока нет сообщений
        </p>
      )}

      {data && data.content.length > 0 && (
        <ul
          aria-label="Сообщения чата"
          className="flex min-h-full gap-3 p-4 flex-col-reverse"
        >
          {data.content.map((message) => (
            <Message key={message.messageId} message={message} />
          ))}
        </ul>
      )}
    </div>
  );
};
