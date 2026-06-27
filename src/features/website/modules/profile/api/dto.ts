import { z } from "zod";

export const TelegramLinkDtoSchema = z.object({
  link: z.string(),
  qr_code: z.string(),
});
export type TelegramLinkDto = z.infer<typeof TelegramLinkDtoSchema>;
