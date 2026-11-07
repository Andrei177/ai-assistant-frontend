import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  messageKeys,
  updateLatestMessagePage,
  useHandleVoiceMessage,
} from "@/entities/message";
import type {
  HandleVoiceMessageResponse,
  MessagePage,
  MessagePageParams,
  MessageType,
} from "@/entities/message";

const createEmptyMessagesData = (
  params?: MessagePageParams,
): InfiniteData<MessagePage> => {
  const sort = { empty: true, sorted: false, unsorted: true };
  const size = params?.size ?? 20;
  const number = params?.page ?? 0;

  return {
    pages: [
      {
        content: [],
        empty: true,
        first: true,
        last: true,
        number,
        numberOfElements: 0,
        pageable: {
          offset: number * size,
          pageNumber: number,
          pageSize: size,
          paged: true,
          unpaged: false,
          sort,
        },
        size,
        sort,
        totalElements: 0,
        totalPages: 0,
      },
    ],
    pageParams: [number],
  };
};

const createPendingMessage = (
  chatId: number,
  audioFile: File,
): MessageType => ({
  messageId: `pending-voice-${crypto.randomUUID()}`,
  chatId,
  content: "",
  contentType: "VOICE",
  audioUrl: null,
  audioFile,
  isSending: true,
  role: "USER",
  transcription: null,
  createdAt: new Date().toISOString(),
  isStreaming: false,
});

const createSentMessage = (
  pendingMessage: MessageType,
  response: HandleVoiceMessageResponse,
): MessageType => ({
  ...pendingMessage,
  messageId: response.messageId,
  content: response.transcription,
  audioFile: undefined,
  isSending: false,
  transcription: response.transcription,
});

export const useSendAudioMessage = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useHandleVoiceMessage();

  return useCallback(
    async (chatId: number, audioFile: File, params?: MessagePageParams) => {
      const queryKey = messageKeys.infiniteList(chatId, params);
      const pendingMessage = createPendingMessage(chatId, audioFile);

      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<InfiniteData<MessagePage>>(
        queryKey,
        (old) =>
          updateLatestMessagePage(
            old ?? createEmptyMessagesData(params),
            (page) => ({
              ...page,
              content: [pendingMessage, ...page.content],
            }),
          ),
      );

      try {
        const response = await mutateAsync({ chatId, audio: audioFile });
        const sentMessage = createSentMessage(pendingMessage, response);

        queryClient.setQueryData<InfiniteData<MessagePage>>(queryKey, (old) =>
          updateLatestMessagePage(old, (page) => {
            const pendingMessageExists = page.content.some(
              (message) => message.messageId === pendingMessage.messageId,
            );
            if (!pendingMessageExists) return page;

            return {
              ...page,
              content: [
                sentMessage,
                ...page.content.filter(
                  (message) =>
                    message.messageId !== pendingMessage.messageId &&
                    message.messageId !== sentMessage.messageId,
                ),
              ],
            };
          }),
        );
      } catch (error) {
        queryClient.setQueryData<InfiniteData<MessagePage>>(queryKey, (old) =>
          updateLatestMessagePage(old, (page) => ({
            ...page,
            content: page.content.filter(
              (message) => message.messageId !== pendingMessage.messageId,
            ),
          })),
        );
        throw error;
      }
    },
    [mutateAsync, queryClient],
  );
};
