import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, Modal, Routes } from "@/shared";
import { useDeleteAccount } from "../utils/use-delete-account";

export const DeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();

  const handleOpenChange = (open: boolean) => {
    if (!open && deleteAccount.isPending) return;
    setIsOpen(open);
  };

  const handleDelete = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        setIsOpen(false);
        navigate(Routes.LOGIN, { replace: true });
      },
    });
  };

  return (
    <section
      aria-labelledby="delete-account-heading"
      className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5"
    >
      <h2
        id="delete-account-heading"
        className="text-lg font-semibold text-destructive"
      >
        Красная зона
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Удаление аккаунта необратимо. Данные аккаунта и связанные с ним данные
        будут удалены.
      </p>
      <Button
        type="button"
        variant="destructive"
        className="mt-4 cursor-pointer"
        onClick={() => {
          deleteAccount.reset();
          setIsOpen(true);
        }}
      >
        Удалить аккаунт
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Удалить аккаунт?"
        description="Это действие нельзя отменить. Ваш аккаунт и связанные с ним данные будут удалены."
      >
        <div className="grid gap-4">
          {deleteAccount.isError && (
            <p role="alert" className="text-sm text-destructive">
              {deleteAccount.error.message ||
                "Не удалось удалить аккаунт. Попробуйте ещё раз."}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={deleteAccount.isPending}
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              disabled={deleteAccount.isPending}
              onClick={handleDelete}
            >
              {deleteAccount.isPending ? "Удаляем..." : "Удалить аккаунт"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};
