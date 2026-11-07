import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Routes } from "@/shared";
import { useLogout } from "../utils/use-logout";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate(Routes.LOGIN, { replace: true });
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Не удалось выйти из аккаунта.",
        );
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      aria-label="Выйти из аккаунта"
      className="inline-flex cursor-pointer min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:flex-none sm:px-3 sm:text-sm"
    >
      <HugeiconsIcon
        icon={Logout01Icon}
        className="size-5"
        aria-hidden="true"
      />
      <span className="max-w-20 text-center leading-tight sm:max-w-none sm:whitespace-nowrap">
        {logoutMutation.isPending ? "Выходим..." : "Выйти"}
      </span>
    </button>
  );
};
