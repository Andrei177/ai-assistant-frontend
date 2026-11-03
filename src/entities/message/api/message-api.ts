import { api } from "@/shared";
import type {
  HandleVoiceMessageRequest,
  HandleVoiceMessageResponse,
  Message,
  MessageAudio,
  MessageFeedback,
  MessagePage,
  MessagePageParams,
  TranslateRequest,
  TranslateResponse,
} from "../model/types";

export const messageApi = {
  getMessagesByChatId: async (
    chatId: number,
    pageable?: MessagePageParams,
  ): Promise<MessagePage> => {
    const response = await api.get<MessagePage>(
      `/v1/chats/${chatId}/messages`,
      { params: pageable },
    );
    return response.data;
  },

  getMessageById: async (messageId: number): Promise<Message> => {
    const response = await api.get<Message>(`/v1/messages/${messageId}`);
    return response.data;
  },

  getMessageFeedback: async (
    messageId: number,
  ): Promise<MessageFeedback> => {
    const response = await api.get<MessageFeedback>(
      `/v1/messages/${messageId}/feedback`,
    );
    return response.data;
  },

  translateMessage: async (
    messageId: number,
    request: TranslateRequest,
  ): Promise<TranslateResponse> => {
    const response = await api.post<TranslateResponse>(
      `/v1/messages/${messageId}/translate`,
      request,
    );
    return response.data;
  },

  handleVoiceMessage: async ({
    chatId,
    audio,
  }: HandleVoiceMessageRequest): Promise<HandleVoiceMessageResponse> => {
    const formData = new FormData();
    formData.append("chatId", String(chatId));
    formData.append("audio", audio);

    const response = await api.post<HandleVoiceMessageResponse>(
      "/v1/messages/voice",
      formData,
    );
    return response.data;
  },

  getAudio: async (
    messageId: number,
    range?: string,
  ): Promise<MessageAudio> => {
    const response = await api.get<Blob>(`/v1/messages/${messageId}/audio`, {
      responseType: "blob",
      headers: range ? { Range: range } : undefined,
    });

    return {
      blob: response.data,
      contentType:
        typeof response.headers["content-type"] === "string"
          ? response.headers["content-type"]
          : null,
      contentRange:
        typeof response.headers["content-range"] === "string"
          ? response.headers["content-range"]
          : null,
      acceptRanges:
        typeof response.headers["accept-ranges"] === "string"
          ? response.headers["accept-ranges"]
          : null,
    };
  },
};
