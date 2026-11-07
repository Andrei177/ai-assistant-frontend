import { useEffect, useRef } from "react";
import { Button } from "@/shared";
import { useMessageAudio } from "../utils/message-hooks";

type AudioPlayerProps = {
  messageId: number | string;
  audioFile?: File;
  isSending?: boolean;
};

export const AudioPlayer = ({
  messageId,
  audioFile,
  isSending = false,
}: AudioPlayerProps) => {
  const audioQuery = useMessageAudio(messageId);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    const audioBlob = audioFile ?? audioQuery.data?.blob;

    if (!audioElement || !audioBlob) return;

    const objectUrl = URL.createObjectURL(audioBlob);
    audioElement.src = objectUrl;

    return () => {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();
      URL.revokeObjectURL(objectUrl);
    };
  }, [audioFile, audioQuery.data?.blob]);

  if (!audioFile && audioQuery.isPending) {
    return (
      <p role="status" className="text-sm opacity-75">
        Загружаем аудио...
      </p>
    );
  }

  if (!audioFile && audioQuery.isError) {
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
    <div className="grid gap-1">
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        className="max-w-full"
        aria-label="Аудиосообщение"
      />
      {isSending && (
        <p role="status" className="text-xs opacity-75">
          Отправляется...
        </p>
      )}
    </div>
  );
};
