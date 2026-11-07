export type MessageContentType = "TEXT" | "VOICE";
export type MessageRole = "USER" | "ASSISTANT";

export type Message = {
  messageId: number | string;
  chatId: number;
  content: string;
  contentType: MessageContentType;
  audioUrl: string | null;
  audioFile?: File;
  isSending?: boolean;
  role: MessageRole;
  transcription: string | null;
  createdAt: string;
  isStreaming: boolean;
};

export type MessageFeedback = {
  messageId: number;
  overallScore: number | null;
  grammarScore: number | null;
  vocabularyScore: number | null;
  naturalnessScore: number | null;
  correctedText: string | null;
  explanation: string | null;
};

export type TranslateRequest = {
  targetLanguage: string;
};

export type TranslateResponse = {
  messageId: number;
  original: string;
  translated: string;
  targetLanguage: string;
};

export type HandleVoiceMessageResponse = {
  messageId: number;
  transcription: string;
};

export type HandleVoiceMessageRequest = {
  chatId: number;
  audio: File;
};

export type MessagePageParams = {
  page?: number;
  size?: number;
  sort?: string;
};

type SortInfo = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

type PageableInfo = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: SortInfo;
};

export type MessagePage = {
  content: Message[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: PageableInfo;
  size: number;
  sort: SortInfo;
  totalElements: number;
  totalPages: number;
};

export type MessageAudio = {
  blob: Blob;
  contentType: string | null;
  contentRange: string | null;
  acceptRanges: string | null;
};

export const WebSocketMessageTypes = {
  AUTH: "AUTH",
  AUTH_OK: "AUTH_OK",
  AUTH_FAILED: "AUTH_FAILED",
  SEND_MESSAGE: "SEND_MESSAGE",
  MESSAGE_ACCEPTED: "MESSAGE_ACCEPTED",
  MESSAGE_STREAM: "MESSAGE_STREAM",
  MESSAGE_STREAM_COMPLETED: "MESSAGE_STREAM_COMPLETED",
  ERROR: "ERROR",
} as const;

export type WebSocketMessageType =
  (typeof WebSocketMessageTypes)[keyof typeof WebSocketMessageTypes];

export const WebSocketErrorCodes = {
  MALFORMED_JSON: "MALFORMED_JSON",
  INVALID_MESSAGE: "INVALID_MESSAGE",
  UNKNOWN_TYPE: "UNKNOWN_TYPE",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",
};

export type WebSocketErrorCode =
  (typeof WebSocketErrorCodes)[keyof typeof WebSocketErrorCodes];
