import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { SpeechToTextIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/shared";
import type { Message as MessageData } from "../model/types";
import { useMessageAudio } from "../utils/message-hooks";

type MessageProps = {
  message: MessageData;
  translation?: ReactNode;
};

type AudioPlayerProps = {
  messageId: number | string;
};

const formatMessageTime = (createdAt: string) => {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
};

const AudioPlayer = ({ messageId }: AudioPlayerProps) => {
  const audioQuery = useMessageAudio(messageId);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    const audioBlob = audioQuery.data?.blob;

    if (!audioElement || !audioBlob) return;

    const objectUrl = URL.createObjectURL(audioBlob);
    audioElement.src = objectUrl;

    return () => {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();
      URL.revokeObjectURL(objectUrl);
    };
  }, [audioQuery.data?.blob]);

  if (audioQuery.isPending) {
    return (
      <p role="status" className="text-sm opacity-75">
        Загружаем аудио...
      </p>
    );
  }

  if (audioQuery.isError) {
    return (
      <div className="grid gap-2">
        <p role="alert" className="text-sm text-destructive">
          Не удалось загрузить аудио.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-fit cursor-pointer"
          onClick={() => void audioQuery.refetch()}
        >
          Повторить загрузку аудио
        </Button>
      </div>
    );
  }

  return (
    <audio
      ref={audioRef}
      controls
      preload="metadata"
      className="max-w-full"
      aria-label="Аудиосообщение"
    />
  );
};

export const Message = ({ message, translation }: MessageProps) => {
  const isAudio = message.contentType === "VOICE";
  const isUserMessage = message.role === "USER";
  const [shouldLoadAudio, setShouldLoadAudio] = useState(false);
  const [isTranscriptionVisible, setIsTranscriptionVisible] = useState(false);
  const messageTime = formatMessageTime(message.createdAt);

  return (
    <li className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
      <article
        aria-label={isUserMessage ? "Сообщение пользователя" : "Сообщение"}
        className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isUserMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {isAudio ? (
          <div className="grid gap-2">
            {!shouldLoadAudio && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-fit cursor-pointer"
                onClick={() => setShouldLoadAudio(true)}
              >
                Прослушать аудио
              </Button>
            )}
            {shouldLoadAudio && <AudioPlayer messageId={message.messageId} />}
            {message.transcription && (
              <>
                {isTranscriptionVisible && (
                  <p className="wrap-break-word text-sm">
                    {message.transcription}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer"
                  aria-label={
                    isTranscriptionVisible
                      ? "Скрыть транскрипцию"
                      : "Показать транскрипцию"
                  }
                  aria-expanded={isTranscriptionVisible}
                  onClick={() =>
                    setIsTranscriptionVisible((isVisible) => !isVisible)
                  }
                >
                  <HugeiconsIcon icon={SpeechToTextIcon} aria-hidden="true" />
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            <p className="wrap-break-word whitespace-pre-wrap text-sm">
              {message.content}
            </p>
            {translation}
          </div>
        )}
        {messageTime && (
          <time
            dateTime={message.createdAt}
            className="mt-2 block text-right text-xs opacity-70"
          >
            {messageTime}
          </time>
        )}
      </article>
    </li>
  );
};
