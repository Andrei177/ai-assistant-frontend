export type MessageContentType = "TEXT" | "VOICE";
export type MessageRole = "USER" | "ASSISTANT";

export type Message = {
  messageId: number;
  content: string;
  contentType: MessageContentType;
  audioUrl: string | null;
  role: MessageRole;
  transcription: string | null;
  createdAt: string;
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
