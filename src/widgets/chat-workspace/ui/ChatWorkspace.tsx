import { useEffect, useRef, useState } from "react";
import { ChatList, chatKeys, useChat } from "@/entities/chat";
import type { InfiniteData } from "@tanstack/react-query";
import {
  messageKeys,
  MessageList,
  WebSocketMessageTypes,
  type MessagePage,
  type MessagePageParams,
  type MessageType,
} from "@/entities/message";
import { DeleteChat } from "@/features/delete-chat";
import { RenameChat } from "@/features/rename-chat";
import { CreateChat } from "@/features/create-chat";
import { ChatInput } from "@/features/send-text-message";
import { TranslateMessage } from "@/features/translate-message";
import { useAuthStore } from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";

const messageParams: MessagePageParams = {
  sort: "createdAt,desc",
};

const updateLatestMessagePage = (
  data: InfiniteData<MessagePage> | undefined,
  update: (page: MessagePage) => MessagePage,
) => {
  if (!data || data.pages.length === 0) return data;

  return {
    ...data,
    pages: data.pages.map((page, index) => (index === 0 ? update(page) : page)),
  };
};

export const ChatWorkspace = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { data: selectedChatData } = useChat(selectedChatId ?? 0);
  const selectedChat = selectedChatData ?? null;
  const token = useAuthStore((state) => state.token);
  //const [status, setStatus] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080/ws/chats");
    wsRef.current = ws;

    ws.onopen = () => {
      //setStatus(true);
      console.log("WS соединение ОТКРЫТО");
      ws.send(
        JSON.stringify({
          type: WebSocketMessageTypes.AUTH,
          accessToken: token,
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const chatId = data.chatId || data.message?.chatId;

      console.log("Пришло по WS");
      console.log(data);

      if (!chatId) return;

      const targetQueryKey = messageKeys.infiniteList(chatId, messageParams);

      if (data.type === WebSocketMessageTypes.MESSAGE_ACCEPTED) {
        queryClient.setQueryData(
          targetQueryKey,
          (old: InfiniteData<MessagePage> | undefined) =>
            updateLatestMessagePage(old, (page) => ({
              ...page,
              content: [data.message, ...page.content],
            })),
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
                      content: firstMessage.content + data.token,
                    },
                    ...page.content.slice(1),
                  ],
                };
              }

              const streamingMessage: MessageType = {
                messageId: `stream-${chatId}`,
                content: data.token,
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
        queryClient.setQueryData(
          targetQueryKey,
          (old: InfiniteData<MessagePage> | undefined) =>
            updateLatestMessagePage(old, (page) => ({
              ...page,
              content: [
                data.message,
                ...page.content.filter(
                  (message) => message.messageId !== `stream-${chatId}`,
                ),
              ],
            })),
        );
      }
    };
    ws.onclose = () => {
      //setStatus(false);
      console.log("WS соединение ЗАКРЫТО");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [token, queryClient]);

  return (
    <div className="grid h-[calc(100dvh-11rem)] min-h-80 grid-rows-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-4 overflow-hidden lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-1">
      <ChatList
        selectedChatId={selectedChatId}
        onSelectChat={(chat) => {
          queryClient.setQueryData(chatKeys.detail(chat.chatId), chat);
          setSelectedChatId(chat.chatId);
        }}
        renderActions={(chat) => (
          <>
            <RenameChat chat={chat} />
            <DeleteChat
              chat={chat}
              onDeleted={(chatId) => {
                if (selectedChatId === chatId) {
                  setSelectedChatId(null);
                }
              }}
            />
          </>
        )}
        createAction={() => <CreateChat />}
      />
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <section
          aria-label="Сообщения"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
        >
          {selectedChat ? (
            <>
              <header className="border-b px-4 py-4">
                <h1 className="truncate font-semibold">
                  {selectedChat.chatName}
                </h1>
              </header>
              <div className="min-h-0 flex-1">
                <MessageList
                  chatId={selectedChat.chatId}
                  params={messageParams}
                  renderTranslation={(messageId) => (
                    <TranslateMessage messageId={messageId} />
                  )}
                />
              </div>
            </>
          ) : (
            <p className="m-auto p-6 text-center text-sm text-muted-foreground">
              Выберите чат, чтобы посмотреть сообщения
            </p>
          )}
        </section>
        <div className="shrink-0 rounded-2xl bg-card p-2 ring-1 ring-foreground/10">
          <ChatInput wsRef={wsRef} selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );
};
