export type Chat = {
  chatId: number;
  chatName: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateChatRequest = {
  chatName: string;
};

export type UpdateChatRequest = {
  chatName: string;
};

export type CreateChatResponse = Pick<Chat, "chatId" | "chatName" | "createdAt">;

export type ChatPageParams = {
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

export type ChatPage = {
  content: Chat[];
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
