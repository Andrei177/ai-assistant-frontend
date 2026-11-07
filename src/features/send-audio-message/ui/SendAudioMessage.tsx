import { useCallback, useEffect, useRef, useState } from "react";
import { Mic01Icon, StopIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/shared";
import type { Chat } from "@/entities/chat";
import type { MessagePageParams } from "@/entities/message";
import { useSendAudioMessage } from "../utils/use-send-audio-message";

type SendAudioMessageProps = {
  selectedChat: Chat | null;
  params?: MessagePageParams;
};

const getAudioFileExtension = (mimeType: string) =>
  mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";

export const SendAudioMessage = ({
  selectedChat,
  params,
}: SendAudioMessageProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingChatIdRef = useRef<number | null>(null);
  const discardRecordingRef = useRef(false);
  const mountedRef = useRef(true);
  const selectedChatIdRef = useRef(selectedChat?.chatId ?? null);
  const sendAudioMessage = useSendAudioMessage();

  useEffect(() => {
    selectedChatIdRef.current = selectedChat?.chatId ?? null;
  }, [selectedChat?.chatId]);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const cancelRecording = useCallback(() => {
    discardRecordingRef.current = true;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      stopTracks();
      recorderRef.current = null;
      setIsRecording(false);
      setIsPreparing(false);
    }
  }, [stopTracks]);

  useEffect(() => {
    if (
      recordingChatIdRef.current !== null &&
      recordingChatIdRef.current !== selectedChatIdRef.current
    ) {
      cancelRecording();
    }
  }, [cancelRecording, selectedChat?.chatId]);

  useEffect(
    () => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        discardRecordingRef.current = true;
        const recorder = recorderRef.current;
        if (recorder && recorder.state !== "inactive") recorder.stop();
        stopTracks();
      };
    },
    [stopTracks],
  );

  const startRecording = async () => {
    const chatId = selectedChat?.chatId;
    if (!chatId) return;

    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setErrorMessage("Запись аудио не поддерживается этим браузером.");
      return;
    }

    setIsPreparing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!mountedRef.current || selectedChatIdRef.current !== chatId) {
        stream.getTracks().forEach((track) => track.stop());
        if (mountedRef.current) setIsPreparing(false);
        return;
      }

      streamRef.current = stream;
      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      recorderRef.current = recorder;
      chunksRef.current = [];
      recordingChatIdRef.current = chatId;
      discardRecordingRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        discardRecordingRef.current = true;
        setErrorMessage("Не удалось записать аудио.");
        if (recorder.state !== "inactive") recorder.stop();
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const shouldDiscard = discardRecordingRef.current;
        const targetChatId = recordingChatIdRef.current;
        const audioFile = new File(
          [audioBlob],
          `voice-message-${Date.now()}.${getAudioFileExtension(audioBlob.type)}`,
          { type: audioBlob.type || "audio/webm" },
        );

        chunksRef.current = [];
        recorderRef.current = null;
        recordingChatIdRef.current = null;
        stopTracks();

        if (!mountedRef.current) return;
        setIsRecording(false);
        setIsPreparing(false);

        if (shouldDiscard) return;
        if (!targetChatId || audioFile.size === 0) {
          setErrorMessage("Не удалось записать аудио.");
          return;
        }

        setIsSending(true);
        void sendAudioMessage(targetChatId, audioFile, params)
          .catch(() => {
            if (mountedRef.current) {
              setErrorMessage("Не удалось отправить голосовое сообщение.");
            }
          })
          .finally(() => {
            if (mountedRef.current) setIsSending(false);
          });
      };

      recorder.start();
      setIsPreparing(false);
      setIsRecording(true);
    } catch {
      stopTracks();
      setIsPreparing(false);
      setErrorMessage(
        "Не удалось получить доступ к микрофону. Проверьте разрешение браузера.",
      );
    }
  };

  const stopAndSend = () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    setIsPreparing(true);
    recorder.stop();
  };

  const busy = isRecording || isPreparing || isSending;

  return (
    <div className="relative flex shrink-0 items-center gap-1">
      {isRecording ? (
        <>
          <p role="status" className="text-xs whitespace-nowrap text-destructive">
            Идёт запись...
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
            aria-label="Остановить и отправить голосовое сообщение"
            onClick={stopAndSend}
          >
            <HugeiconsIcon icon={StopIcon} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
            aria-label="Отменить запись голосового сообщения"
            onClick={cancelRecording}
          >
            <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer"
          disabled={!selectedChat?.chatId || busy}
          aria-label="Записать голосовое сообщение"
          onClick={() => void startRecording()}
        >
          <HugeiconsIcon icon={Mic01Icon} aria-hidden="true" />
        </Button>
      )}
      {isPreparing && (
        <p role="status" className="text-sm text-muted-foreground">
          Подготовка записи...
        </p>
      )}
      {errorMessage && (
        <p
          role="alert"
          className="absolute bottom-full right-0 z-10 mb-2 w-72 rounded-lg bg-card p-3 text-sm text-destructive shadow-md"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
