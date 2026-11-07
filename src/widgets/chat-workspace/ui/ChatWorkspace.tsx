import { useState } from "react";
import { ChatList, chatKeys, useChat } from "@/entities/chat";
import { MessageList } from "@/entities/message";
import { DeleteChat } from "@/features/delete-chat";
import { RenameChat } from "@/features/rename-chat";
import { CreateChat } from "@/features/create-chat";
import { ChatInput } from "@/features/send-text-message";
import { SendAudioMessage } from "@/features/send-audio-message";
import { TranslateMessage } from "@/features/translate-message";
import { GetFeedbackForMessage } from "@/features/get-feedback-for-message";
import { useQueryClient } from "@tanstack/react-query";
import { useChatWebSocket } from "../utils/use-chat-web-socket";
import { messageParams } from "../utils/message-params";

export const ChatWorkspace = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { data: selectedChatData } = useChat(selectedChatId ?? 0);
  const selectedChat = selectedChatData ?? null;
  const wsRef = useChatWebSocket();
  const queryClient = useQueryClient();

  return (
    <div className="grid h-[calc(100dvh-8rem)] min-h-80 grid-rows-[minmax(0,0.25fr)_minmax(0,0.75fr)] gap-4 overflow-hidden lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-1">
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
                  renderFeedback={(messageId) => (
                    <GetFeedbackForMessage messageId={messageId} />
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
          <ChatInput
            wsRef={wsRef}
            selectedChat={selectedChat}
            rightAction={
              <SendAudioMessage
                selectedChat={selectedChat}
                params={messageParams}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
