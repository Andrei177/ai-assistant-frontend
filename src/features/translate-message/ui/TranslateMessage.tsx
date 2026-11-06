import { AiTranslateIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/shared";
import { useTranslateMessage } from "../utils/use-translate-message";

type TranslateMessageProps = {
  messageId: number;
};

export const TranslateMessage = ({ messageId }: TranslateMessageProps) => {
  const translation = useTranslateMessage();

  const handleTranslate = () => {
    translation.mutate({
      messageId,
      request: { targetLanguage: "ru" },
    });
  };

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="w-fit cursor-pointer"
        aria-label="Перевести сообщение на русский"
        disabled={translation.isPending}
        onClick={handleTranslate}
      >
        <HugeiconsIcon icon={AiTranslateIcon} aria-hidden="true" />
      </Button>
      {translation.isPending && (
        <p role="status" className="text-sm opacity-75">
          Переводим...
        </p>
      )}
      {translation.isError && (
        <p role="alert" className="text-sm text-destructive">
          Не удалось перевести сообщение.
        </p>
      )}
      {translation.data && (
        <div className="grid gap-2">
          <hr className="border-foreground/30 border-t-2" />
          <p className="wrap-break-word whitespace-pre-wrap text-sm">
            {translation.data.translated}
          </p>
        </div>
      )}
    </div>
  );
};
