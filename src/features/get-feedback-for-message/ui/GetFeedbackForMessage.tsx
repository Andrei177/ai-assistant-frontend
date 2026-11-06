import { ChartEvaluationIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button, Modal } from "@/shared";
import { useMessageFeedback } from "../utils/use-message-feedback";

type GetFeedbackForMessageProps = {
  messageId: number;
};

const scoreLabels = [
  ["overallScore", "Общая оценка"],
  ["grammarScore", "Грамматика"],
  ["vocabularyScore", "Словарный запас"],
  ["naturalnessScore", "Естественность речи"],
] as const;

export const GetFeedbackForMessage = ({
  messageId,
}: GetFeedbackForMessageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const feedback = useMessageFeedback(messageId, isOpen);

  return (
    <>
      <div className="group relative w-fit">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          aria-label="Получить оценку"
          onClick={() => setIsOpen(true)}
        >
          <HugeiconsIcon icon={ChartEvaluationIcon} aria-hidden="true" />
        </Button>
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          Оценить
        </span>
      </div>
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Оценка сообщения"
        description="Оценки по шкале от 0 до 100, исправленный вариант и пояснение."
      >
        {feedback.isPending && (
          <p role="status" className="text-sm text-muted-foreground">
            Получаем оценку...
          </p>
        )}
        {feedback.isError && (
          <div className="grid gap-3">
            <p role="alert" className="text-sm text-destructive">
              Не удалось получить оценку сообщения.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-fit cursor-pointer"
              onClick={() => void feedback.refetch()}
            >
              Повторить
            </Button>
          </div>
        )}
        {feedback.data && (
          <div className="grid max-h-[60vh] gap-5 overflow-y-auto">
            <dl className="grid gap-3">
              {scoreLabels.map(([key, label]) => {
                const score = feedback.data[key];

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-sm">{label}</dt>
                    <dd className="font-semibold tabular-nums">
                      {score === null ? "—" : `${score} / 100`}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <section className="grid gap-2">
              <h3 className="text-sm font-semibold">Исправленный вариант</h3>
              <p className="wrap-break-word whitespace-pre-wrap text-sm">
                {feedback.data.correctedText ?? "Нет данных"}
              </p>
            </section>
            <section className="grid gap-2">
              <h3 className="text-sm font-semibold">Пояснение</h3>
              <p className="wrap-break-word whitespace-pre-wrap text-sm">
                {feedback.data.explanation ?? "Нет данных"}
              </p>
            </section>
          </div>
        )}
      </Modal>
    </>
  );
};
