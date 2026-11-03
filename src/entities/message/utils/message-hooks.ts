import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { messageApi } from "../api/message-api";
import type {
  HandleVoiceMessageRequest,
  MessagePageParams,
  TranslateRequest,
} from "../model/types";

export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (chatId: number, params?: MessagePageParams) =>
    [...messageKeys.lists(), chatId, params] as const,
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (messageId: number) =>
    [...messageKeys.details(), messageId] as const,
  feedback: (messageId: number) =>
    [...messageKeys.all, "feedback", messageId] as const,
  audio: (messageId: number, range?: string) =>
    range
      ? ([...messageKeys.all, "audio", messageId, range] as const)
      : ([...messageKeys.all, "audio", messageId] as const),
};

export const useMessagesByChatId = (
  chatId: number,
  params?: MessagePageParams,
) =>
  useQuery({
    queryKey: messageKeys.list(chatId, params),
    queryFn: () => messageApi.getMessagesByChatId(chatId, params),
    enabled: Number.isFinite(chatId) && chatId > 0,
  });

export const useMessage = (messageId: number) =>
  useQuery({
    queryKey: messageKeys.detail(messageId),
    queryFn: () => messageApi.getMessageById(messageId),
    enabled: Number.isFinite(messageId) && messageId > 0,
  });

export const useMessageFeedback = (messageId: number) =>
  useQuery({
    queryKey: messageKeys.feedback(messageId),
    queryFn: () => messageApi.getMessageFeedback(messageId),
    enabled: Number.isFinite(messageId) && messageId > 0,
  });

export const useMessageAudio = (messageId: number, range?: string) =>
  useQuery({
    queryKey: messageKeys.audio(messageId, range),
    queryFn: () => messageApi.getAudio(messageId, range),
    enabled: Number.isFinite(messageId) && messageId > 0,
  });

export const useTranslateMessage = () =>
  useMutation({
    mutationFn: ({
      messageId,
      request,
    }: {
      messageId: number;
      request: TranslateRequest;
    }) => messageApi.translateMessage(messageId, request),
  });

export const useHandleVoiceMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: HandleVoiceMessageRequest) =>
      messageApi.handleVoiceMessage(request),
    onSuccess: (_response, request) =>
      queryClient.invalidateQueries({
        queryKey: messageKeys.lists(),
        predicate: (query) => query.queryKey[2] === request.chatId,
      }),
  });
};
