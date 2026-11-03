import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../api/chat-api";
import type { ChatPageParams } from "../model/types";

export const chatKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (params?: ChatPageParams) => [...chatKeys.lists(), params] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (chatId: number) => [...chatKeys.details(), chatId] as const,
};

export const useChats = (params?: ChatPageParams) =>
  useQuery({
    queryKey: chatKeys.list(params),
    queryFn: () => chatApi.getChats(params),
  });

export const useChat = (chatId: number) =>
  useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: () => chatApi.getChat(chatId),
    enabled: Number.isFinite(chatId) && chatId > 0,
  });
