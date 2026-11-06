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
      <div className="group relative w-fit">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          aria-label="Перевод"
          disabled={translation.isPending}
          onClick={handleTranslate}
        >
          <HugeiconsIcon icon={AiTranslateIcon} aria-hidden="true" />
        </Button>
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          Перевести
        </span>
      </div>
      {(translation.isPending || translation.isError || translation.data) && (
        <div className="grid gap-2">
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
            <>
              <hr className="border-foreground/30 border-t-2" />
              <p className="wrap-break-word whitespace-pre-wrap text-sm">
                {translation.data.translated}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
