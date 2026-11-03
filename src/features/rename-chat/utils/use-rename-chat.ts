import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi, chatKeys, type UpdateChatRequest } from "@/entities/chat";

type RenameChatVariables = {
  chatId: number;
  request: UpdateChatRequest;
};

export const useRenameChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, request }: RenameChatVariables) =>
      chatApi.updateChat(chatId, request),
    onSuccess: (chat) => {
      queryClient.setQueryData(chatKeys.detail(chat.chatId), chat);
      return queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};
