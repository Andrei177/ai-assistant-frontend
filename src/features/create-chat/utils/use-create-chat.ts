import { chatApi, chatKeys, type CreateChatRequest } from "@/entities/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateChatRequest) => chatApi.createChat(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() }),
  });
};
