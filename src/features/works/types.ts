import { type Work } from "@/entities/work/types";

export type BackofficeWork = Work & {
  isPublished: boolean;
};

export type SetPublishedPayload = {
  is_published: boolean;
};
