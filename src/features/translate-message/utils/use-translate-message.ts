import { useMutation } from "@tanstack/react-query";
import { messageApi, type TranslateRequest } from "@/entities/message";

type TranslateMessageVariables = {
  messageId: number;
  request: TranslateRequest;
};

export const useTranslateMessage = () =>
  useMutation({
    mutationFn: ({ messageId, request }: TranslateMessageVariables) =>
      messageApi.translateMessage(messageId, request),
  });
