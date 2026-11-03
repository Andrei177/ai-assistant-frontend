import { Edit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button, Input, Modal } from "@/shared";
import type { Chat } from "@/entities/chat";
import { useRenameChat } from "../utils/use-rename-chat";
import { toast } from "sonner";

type RenameChatProps = {
  chat: Chat;
};

export const RenameChat = ({ chat }: RenameChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatName, setChatName] = useState(chat.chatName);
  const renameChat = useRenameChat();

  const handleOpenChange = (open: boolean) => {
    if (!open && renameChat.isPending) return;
    setIsOpen(open);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const trimmedChatName = chatName.trim();
    if (!trimmedChatName) return;

    renameChat.mutate(
      { chatId: chat.chatId, request: { chatName: trimmedChatName } },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success("Переименование прошло успешно");
        },
      },
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        aria-label={`Редактировать чат ${chat.chatName}`}
        onClick={() => {
          setChatName(chat.chatName);
          renameChat.reset();
          setIsOpen(true);
        }}
      >
        <HugeiconsIcon icon={Edit01Icon} aria-hidden="true" />
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Изменить название чата"
        description="Введите новое название для чата."
      >
        <form
          onSubmit={(event) => handleSubmit(event.nativeEvent)}
          className="grid gap-4"
        >
          <label htmlFor={`chat-name-${chat.chatId}`} className="sr-only">
            Название чата
          </label>
          <Input
            id={`chat-name-${chat.chatId}`}
            autoFocus
            maxLength={100}
            value={chatName}
            onChange={(event) => setChatName(event.target.value)}
            aria-invalid={Boolean(renameChat.error)}
            aria-describedby={
              renameChat.error ? `chat-edit-error-${chat.chatId}` : undefined
            }
          />
          {renameChat.isError && (
            <p
              id={`chat-edit-error-${chat.chatId}`}
              role="alert"
              className="text-sm text-destructive"
            >
              {renameChat.error.message || "Не удалось изменить чат."}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={renameChat.isPending}
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={renameChat.isPending || !chatName.trim()}
            >
              {renameChat.isPending ? "Сохраняем..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
