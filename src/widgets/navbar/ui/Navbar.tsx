import {
  Chat01Icon,
  Logout01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuthStore } from "@/features/auth";
import { Routes } from "@/shared";
import { useNavigate, NavLink } from "react-router";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 text-xs font-medium transition-colors sm:flex-none sm:px-3 sm:text-sm ${
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;

export const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Routes.LOGIN, { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <span className="text-center text-base font-semibold hover:cursor-[url('heart.svg')_16_16,pointer] sm:text-left">
          AI English Chat
        </span>
        <nav
          aria-label="Основная навигация"
          className="flex w-full items-center gap-1 sm:w-auto sm:gap-2"
        >
          <NavLink to={Routes.CHAT} className={linkClassName}>
            <HugeiconsIcon
              icon={Chat01Icon}
              className="size-5"
              aria-hidden="true"
            />
            <span className="text-center leading-tight">Чат</span>
          </NavLink>
          <NavLink to={Routes.PROFILE} className={linkClassName}>
            <HugeiconsIcon
              icon={UserCircleIcon}
              className="size-5"
              aria-hidden="true"
            />
            <span className="text-center leading-tight">Профиль</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Выйти из аккаунта"
            className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 text-xs font-medium text-muted-foreground  cursor-pointer transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none sm:px-3 sm:text-sm"
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              className="size-5"
              aria-hidden="true"
            />
            <span className="max-w-20 text-center leading-tight sm:max-w-none sm:whitespace-nowrap">
              Выйти из аккаунта
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
