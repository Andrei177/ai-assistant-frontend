import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuthStore } from "@/features/auth";
import { Card, CardContent } from "@/shared";

const formatRegistrationDate = (createdAt: string) => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Дата не указана";
  }

  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(date);
};

export const Profile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        Данные профиля недоступны.
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-xl">
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
    </section>
  );
};
