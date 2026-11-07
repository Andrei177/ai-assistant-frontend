import type { InfiniteData } from "@tanstack/react-query";
import type { MessagePage } from "../model/types";

export const updateLatestMessagePage = (
  data: InfiniteData<MessagePage> | undefined,
  update: (page: MessagePage) => MessagePage,
) => {
  if (!data || data.pages.length === 0) return data;

  return {
    ...data,
    pages: data.pages.map((page, index) => (index === 0 ? update(page) : page)),
  };
};
