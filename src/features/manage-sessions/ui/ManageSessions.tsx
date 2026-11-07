import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
} from "@/shared";
import { useRevokeUserSession, useUserSessions } from "@/entities/user";
import { formatSessionDate } from "../utils/format-session-date";
import { useLogoutAllSessions } from "../utils/use-logout-all-sessions";

type ManageSessionsProps = {
  onAllSessionsEnded: () => void;
};

export const ManageSessions = ({
  onAllSessionsEnded,
}: ManageSessionsProps) => {
  const sessionsQuery = useUserSessions();
  const revokeSession = useRevokeUserSession();
  const logoutAllSessions = useLogoutAllSessions();
  const [revokingTokenId, setRevokingTokenId] = useState<number | null>(null);
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);

  const handleLogoutAllOpenChange = (open: boolean) => {
    if (!open && logoutAllSessions.isPending) return;
    setIsLogoutAllOpen(open);
  };

  const handleRevoke = (tokenId: number) => {
    setRevokingTokenId(tokenId);
    revokeSession.mutate(tokenId, {
      onSettled: () => setRevokingTokenId(null),
    });
  };

  const handleLogoutAll = () => {
    logoutAllSessions.mutate(undefined, {
      onSuccess: () => {
        setIsLogoutAllOpen(false);
        onAllSessionsEnded();
      },
    });
  };

  const isBusy = revokeSession.isPending || logoutAllSessions.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Активные сессии</CardTitle>
        <p className="text-sm text-muted-foreground">
          Здесь можно посмотреть устройства, на которых выполнен вход, и
          завершить ненужные сессии.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button
          type="button"
          variant="destructive"
          className="w-fit cursor-pointer"
          disabled={isBusy}
          onClick={() => {
            logoutAllSessions.reset();
            setIsLogoutAllOpen(true);
          }}
        >
          Завершить все сессии
        </Button>

        {sessionsQuery.isPending && (
          <p role="status" className="text-sm text-muted-foreground">
            Загружаем сессии...
          </p>
        )}

        {sessionsQuery.isError && (
          <div className="grid gap-2">
            <p role="alert" className="text-sm text-destructive">
              Не удалось загрузить список сессий: {sessionsQuery.error.message}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit cursor-pointer"
              onClick={() => void sessionsQuery.refetch()}
            >
              Повторить
            </Button>
          </div>
        )}

        {revokeSession.isError && (
          <p role="alert" className="text-sm text-destructive">
            Не удалось завершить сессию: {revokeSession.error.message}
          </p>
        )}

        {sessionsQuery.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Активных сессий не найдено.
          </p>
        )}

        {sessionsQuery.data && sessionsQuery.data.length > 0 && (
          <ul className="grid gap-3">
            {sessionsQuery.data.map((session) => {
              const isRevoking =
                revokeSession.isPending && revokingTokenId === session.tokenId;

              return (
                <li
                  key={session.tokenId}
                  className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="wrap-break-word font-medium">
                      {session.deviceInfo || "Устройство не указано"}
                    </p>
                    <dl className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <div>
                        <dt className="inline">Вход: </dt>
                        <dd className="inline">
                          {formatSessionDate(session.createdAt)}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline">Истекает: </dt>
                        <dd className="inline">
                          {formatSessionDate(session.expiresAt)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit shrink-0 cursor-pointer"
                    disabled={isBusy}
                    onClick={() => handleRevoke(session.tokenId)}
                  >
                    {isRevoking ? "Завершаем..." : "Завершить"}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
      <Modal
        open={isLogoutAllOpen}
        onOpenChange={handleLogoutAllOpenChange}
        title="Завершить все сессии?"
        description="Вы выйдете из аккаунта на всех устройствах, включая это. Для продолжения потребуется войти снова."
      >
        <div className="grid gap-4">
          {logoutAllSessions.isError && (
            <p role="alert" className="text-sm text-destructive">
              Не удалось завершить все сессии:{" "}
              {logoutAllSessions.error.message}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={logoutAllSessions.isPending}
              onClick={() => setIsLogoutAllOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              disabled={logoutAllSessions.isPending}
              onClick={handleLogoutAll}
            >
              {logoutAllSessions.isPending
                ? "Завершаем..."
                : "Завершить все сессии"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
