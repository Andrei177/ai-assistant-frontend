import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/features/auth";
import { Card, CardContent, Routes } from "@/shared";
import { DeleteAccount } from "@/features/delete-account";
import { ManageSessions } from "@/features/manage-sessions";
import { formatRegistrationDate } from "../utils/format-registration-date";

export const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (!user) {
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        Данные профиля недоступны.
      </p>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-2xl gap-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8 sm:py-10">
          <HugeiconsIcon
            icon={UserCircleIcon}
            className="size-20 text-primary"
            aria-hidden="true"
          />
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Профиль</h1>
          </div>
          <dl className="grid w-full gap-4 rounded-xl bg-muted/50 p-4 sm:grid-cols-2 sm:p-5">
            <div className="min-w-0">
              <dt className="text-sm text-muted-foreground">
                Электронная почта
              </dt>
              <dd className="mt-1 break-all font-medium">{user.userEmail}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                Дата регистрации
              </dt>
              <dd className="mt-1 font-medium">
                {formatRegistrationDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <ManageSessions
        onAllSessionsEnded={() => {
          logout();
          queryClient.setQueryData(["auth-user"], null);
          queryClient.removeQueries({
            predicate: (query) => query.queryKey[0] !== "auth-user",
          });
          navigate(Routes.LOGIN, { replace: true });
        }}
      />
      <DeleteAccount />
    </section>
  );
};
