import { useEffect, useRef, useState } from "react";
import { ChatList, type Chat } from "@/entities/chat";
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
import { useAuthStore } from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";

const messageParams: MessagePageParams = {
  sort: "createdAt,desc",
};

export const ChatWorkspace = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const token = useAuthStore((state) => state.token);
  //const [status, setStatus] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const selectedChatRef = useRef<Chat | null>(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

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

    //   const data = JSON.parse(event.data);
    //   if (
    //     data.type === WebSocketMessageTypes.MESSAGE_ACCEPTED &&
    //     selectedChatRef.current?.chatId
    //   ) {
    //     const newMessage: MessageType = data.message;
    //     queryClient.setQueryData(
    //       messageKeys.list(selectedChatRef.current.chatId, messageParams),
    //       (messages: MessagePage) => {
    //         const clone = structuredClone(messages);

    //         clone.content.unshift(newMessage);
    //         return clone;
    //       },
    //     );
    //   }
    //   if (
    //     data.type === WebSocketMessageTypes.MESSAGE_STREAM &&
    //     selectedChatRef.current?.chatId
    //   ) {
    //     setLlmMessage((prev) => ({
    //       ...prev,
    //       content: prev.content + data.token,
    //     }));
    //   }
    //   if (
    //     data.type === WebSocketMessageTypes.MESSAGE_STREAM_COMPLETED &&
    //     selectedChatRef.current?.chatId
    //   ) {
    //     queryClient.setQueryData(
    //       messageKeys.list(selectedChatRef.current.chatId, messageParams),
    //       (messages: MessagePage) => {
    //         if (!messages) return messages;
    //         const clone = structuredClone(messages);
    //         clone.content.unshift({
    //           ...data.message,
    //         });
    //         return clone;
    //       },
    //     );
    //     setLlmMessage({
    //       messageId: 0,
    //       audioUrl: "",
    //       chatId: 0,
    //       content: "",
    //       contentType: "TEXT",
    //       createdAt: "",
    //       role: "ASSISTANT",
    //       transcription: "",
    //     });
    //   }
    //   console.log("Пришло по WS соединению");
    //   console.log(data);
    // };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const chatId = data.chatId || data.message?.chatId;

      console.log("Пришло по WS");
      console.log(data);

      if (!chatId) return;

      const targetQueryKey = messageKeys.list(chatId, messageParams);

      if (data.type === WebSocketMessageTypes.MESSAGE_ACCEPTED) {
        queryClient.setQueryData(
          targetQueryKey,
          (old: MessagePage | undefined) => {
            if (!old) return old;
            const clone = structuredClone(old);
            clone.content.unshift(data.message);
            return clone;
          },
        );
      }

      if (data.type === WebSocketMessageTypes.MESSAGE_STREAM) {
        queryClient.setQueryData(
          targetQueryKey,
          (old: MessagePage | undefined) => {
            if (!old) return { content: [] };
            const clone = structuredClone(old);

            const firstMessage = clone.content[0];

            if (
              firstMessage &&
              firstMessage.isStreaming &&
              firstMessage.messageId === `stream-${chatId}`
            ) {
              firstMessage.content += data.token;
            } else {
              const streamingMessage: MessageType & { isStreaming: boolean } = {
                messageId: `stream-${chatId}`,
                content: data.token,
                contentType: "TEXT",
                audioUrl: null,
                role: "ASSISTANT",
                transcription: null,
                createdAt: new Date().toISOString(),
                chatId: chatId,
                isStreaming: true,
              };
              clone.content.unshift(streamingMessage);
            }
            return clone;
          },
        );
      }

      if (data.type === WebSocketMessageTypes.MESSAGE_STREAM_COMPLETED) {
        queryClient.setQueryData(
          targetQueryKey,
          (old: MessagePage | undefined) => {
            if (!old) return old;
            const clone = structuredClone(old);

            clone.content = clone.content.filter(
              (msg) => msg.messageId !== `stream-${chatId}`,
            );

            clone.content.unshift(data.message);
            return clone;
          },
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
        selectedChatId={selectedChat?.chatId ?? null}
        onSelectChat={setSelectedChat}
        renderActions={(chat) => (
          <>
            <RenameChat chat={chat} />
            <DeleteChat
              chat={chat}
              onDeleted={(chatId) => {
                if (selectedChat?.chatId === chatId) {
                  setSelectedChat(null);
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
