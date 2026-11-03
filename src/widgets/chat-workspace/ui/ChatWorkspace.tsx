import { useState } from "react";
import { ChatList, type Chat } from "@/entities/chat";
import { MessageList } from "@/entities/message";
import { DeleteChat } from "@/features/delete-chat";
import { RenameChat } from "@/features/rename-chat";

export const ChatWorkspace = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

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
      />
      <section
        aria-label="Сообщения"
        className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
      >
        {selectedChat ? (
          <>
            <header className="border-b px-4 py-4">
              <h1 className="truncate font-semibold">
                {selectedChat.chatName}
              </h1>
            </header>
            <div className="min-h-0 flex-1">
              <MessageList chatId={selectedChat.chatId} />
            </div>
          </>
        ) : (
          <p className="m-auto p-6 text-center text-sm text-muted-foreground">
            Выберите чат, чтобы посмотреть сообщения
          </p>
        )}
      </section>
    </div>
  );
};
