import { useQuery } from "@tanstack/react-query";
import { messageApi } from "@/entities/message";

export const messageFeedbackKeys = {
  all: ["messages", "feedback"] as const,
  byMessageId: (messageId: number) =>
    [...messageFeedbackKeys.all, messageId] as const,
};

export const useMessageFeedback = (messageId: number, enabled = true) =>
  useQuery({
    queryKey: messageFeedbackKeys.byMessageId(messageId),
    queryFn: () => messageApi.getMessageFeedback(messageId),
    enabled: enabled && Number.isFinite(messageId) && messageId > 0,
  });
