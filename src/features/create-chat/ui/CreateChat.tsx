import { Button, Input, Modal } from "@/shared";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCreateChat } from "../utils/use-create-chat";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const CreateChat = () => {
  const createChat = useCreateChat();
  const [isOpen, setIsOpen] = useState(false);
  const [chatName, setChatName] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open && createChat.isPending) return;
    setIsOpen(open);
  };

  const handleCreate = (event: SubmitEvent) => {
    event.preventDefault();
    const currentStr = chatName.trim();

    if (currentStr.length > 30) {
      return toast.error("Название чата не более 30 символов");
    }
    if (currentStr.length === 0) {
      return toast.error("Название чата не может быть пустым");
    }

    createChat.mutate(
      { chatName: currentStr },
      {
        onSuccess: () => {
          setIsOpen(false);
          setChatName("");
          toast.success("Чат создан");
        },
        onError: (err: unknown) => {
          if (err instanceof AxiosError) {
            if (
              err.response?.status === 400 ||
              err.code === "ERR_BAD_REQUEST"
            ) {
              const errorData = err.response?.data;
              if (errorData?.chatName) return toast.error(errorData.chatName);
            }
            if (err.response?.data?.message) {
              return toast.error(err.response.data.message);
            }
          }
          toast.error(
            err instanceof Error ? err.message : "Произошла неизвестная ошибка",
          );
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
        aria-label="Создать чат"
        onClick={() => setIsOpen(true)}
      >
        <HugeiconsIcon icon={Plus} aria-hidden="true" />
      </Button>
      <Modal
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Создание чата"
      >
        <form
          onSubmit={(event) => handleCreate(event.nativeEvent)}
          className="grid gap-4"
        >
          <div>
            <Input
              id="create-chat-name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Название чата"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={createChat.isPending}
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="default"
              className="cursor-pointer bg-green-200 text-black hover:bg-green-300"
              disabled={createChat.isPending}
            >
              {createChat.isPending ? "Создаём..." : "Создать"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
