import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi, chatKeys } from "@/entities/chat";

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: number) => chatApi.deleteChat(chatId),
    onSuccess: (_data, chatId) => {
      queryClient.removeQueries({ queryKey: chatKeys.detail(chatId) });
      return queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};
