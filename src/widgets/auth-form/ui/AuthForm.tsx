import { useLogin, type LoginResponse } from "@/features/login";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Routes,
  type AuthFormData,
} from "@/shared";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { useRegister, type RegisterResponse } from "@/features/register";
import { Link, useNavigate } from "react-router";
import { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth";

type Props = {
  isLogin: boolean;
};

export const AuthForm = ({ isLogin }: Props) => {
  const [formData, setFormData] = useState<AuthFormData>({
    userEmail: "",
    password: "",
  });

  const setUser = useAuthStore((state) => state.setUser);
  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);
  const setToken = useAuthStore((state) => state.setToken);

  const navigate = useNavigate();

  const loginMutate = useLogin();
  const registerMutate = useRegister();

  const isLoading = loginMutate.isPending || registerMutate.isPending;

  const handleMutationSuccess = (data: LoginResponse | RegisterResponse) => {
    setUser(data.user);
    setToken(data.accessToken);
    setAuthChecked(true);

    if (isLogin) {
      toast.success("Успешно вошли в аккаунт");
    } else {
      toast.success("Успешно зарегистрировались");
    }
    navigate(Routes.CHAT);
  };

  const handleMutationError = (err: unknown) => {
    if (err instanceof AxiosError) {
      if (err.response?.status === 400 || err.code === "ERR_BAD_REQUEST") {
        const errorData = err.response?.data;
        if (errorData?.password) return toast.error(errorData.password);
        if (errorData?.userEmail) return toast.error(errorData.userEmail);
      }
      if (err.response?.data?.message) {
        return toast.error(err.response.data.message);
      }
    }

    toast.error(
      err instanceof Error ? err.message : "Произошла неизвестная ошибка",
    );
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      loginMutate.mutate(formData, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      });
      return;
    }
    registerMutate.mutate(formData, {
      onSuccess: handleMutationSuccess,
      onError: handleMutationError,
    });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-background via-muted/40 to-background px-4 py-12">
      <Card className="w-full max-w-md shadow-xl shadow-foreground/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            {isLogin ? "С возвращением!" : "Создайте аккаунт"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Войдите, чтобы продолжить общение на английском"
              : "Зарегистрируйтесь и начните практиковать английский"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="auth-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="auth-email"
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
                value={formData.userEmail}
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="auth-password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="auth-password"
                placeholder="Введите пароль"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="h-11 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t text-center text-sm text-muted-foreground">
            {isLogin ? (
              <p>
                Нет аккаунта?{" "}
                <Link
                  to={Routes.REGISTER}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Зарегистрируйтесь
                </Link>
              </p>
            ) : (
              <p>
                Есть аккаунт?{" "}
                <Link
                  to={Routes.LOGIN}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Войдите
                </Link>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};
