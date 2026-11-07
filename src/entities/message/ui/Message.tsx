import { useState } from "react";
import type { ReactNode } from "react";
import { SpeechToTextIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/shared";
import type { Message as MessageData } from "../model/types";
import { formatMessageTime } from "../utils/format-message-time";
import { AudioPlayer } from "./AudioPlayer";

type MessageProps = {
  message: MessageData;
  translation?: ReactNode;
  feedback?: ReactNode;
};

export const Message = ({ message, translation, feedback }: MessageProps) => {
  const isAudio = message.contentType === "VOICE";
  const isUserMessage = message.role === "USER";
  const [shouldLoadAudio, setShouldLoadAudio] = useState(
    Boolean(message.audioFile),
  );
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
            {shouldLoadAudio && (
              <AudioPlayer
                messageId={message.messageId}
                audioFile={message.audioFile}
                isSending={message.isSending}
              />
            )}
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
          <p className="wrap-break-word whitespace-pre-wrap text-sm">
            {message.content}
          </p>
        )}
        <div className="flex items-start gap-1 ">
          {feedback}
          {translation}
        </div>
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
