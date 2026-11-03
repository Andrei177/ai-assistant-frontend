import { Delete01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Modal } from "@/shared";
import type { Chat } from "@/entities/chat";
import { useDeleteChat } from "../utils/use-delete-chat";

type DeleteChatProps = {
  chat: Chat;
  onDeleted?: (chatId: number) => void;
};

export const DeleteChat = ({ chat, onDeleted }: DeleteChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteChat = useDeleteChat();

  const handleOpenChange = (open: boolean) => {
    if (!open && deleteChat.isPending) return;
    setIsOpen(open);
  };

  const handleDelete = () => {
    deleteChat.mutate(chat.chatId, {
      onSuccess: () => {
        setIsOpen(false);
        onDeleted?.(chat.chatId);
        toast.success("Чат удалён");
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        aria-label={`Удалить чат ${chat.chatName}`}
        onClick={() => {
          deleteChat.reset();
          setIsOpen(true);
        }}
      >
        <HugeiconsIcon icon={Delete01Icon} aria-hidden="true" />
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Удалить чат?"
        description={`Чат «${chat.chatName}» будет удалён без возможности восстановления.`}
      >
        <div className="grid gap-4">
          {deleteChat.isError && (
            <p role="alert" className="text-sm text-destructive">
              {deleteChat.error.message || "Не удалось удалить чат."}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={deleteChat.isPending}
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              disabled={deleteChat.isPending}
              onClick={handleDelete}
            >
              {deleteChat.isPending ? "Удаляем..." : "Удалить"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
