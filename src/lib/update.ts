// update.ts
import { z } from 'zod';
import { MessageSchema } from './message';

export const UpdateInSchema = z.object({
  platform: z.enum(['web', 'whatsapp', 'telegram']),
  chat_id: z.string().nullable().optional(),
  platform_chat_id: z.string().nullable().optional(),
  messages: z.array(MessageSchema),
  bot_username: z.string().nullable().optional()
});

export type UpdateIn = z.infer<typeof UpdateInSchema>;

export const UpdateOutSchema = z.object({
  chat_id: z.string(),
  platform_chat_id: z.string().nullable().optional(),
  messages: z.array(MessageSchema)
});

export type UpdateOut = z.infer<typeof UpdateOutSchema>;

//Devuelve el chatID, el platformChatId, y los mensajes.
