import { api } from "@/shared";
import type {
  Chat,
  ChatPage,
  ChatPageParams,
  CreateChatRequest,
  CreateChatResponse,
  UpdateChatRequest,
} from "../model/types";

export const chatApi = {
  createChat: async (
    request: CreateChatRequest,
  ): Promise<CreateChatResponse> => {
    const response = await api.post<CreateChatResponse>("/v1/chats", request);
    return response.data;
  },

  getChats: async (pageable?: ChatPageParams): Promise<ChatPage> => {
    const response = await api.get<ChatPage>("/v1/chats", {
      params: pageable,
    });
    return response.data;
  },

  getChat: async (chatId: number): Promise<Chat> => {
    const response = await api.get<Chat>(`/v1/chats/${chatId}`);
    return response.data;
  },

  updateChat: async (
    chatId: number,
    request: UpdateChatRequest,
  ): Promise<Chat> => {
    const response = await api.patch<Chat>(`/v1/chats/${chatId}`, request);
    return response.data;
  },

  deleteChat: async (chatId: number): Promise<void> => {
    await api.delete<void>(`/v1/chats/${chatId}`);
  },
};
