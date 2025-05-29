// message.ts
import { z } from 'zod';
import { Role } from './types';

// --- Schemas and Types ---
const TextContent = z.object({
  type: z.literal('text'),
  value: z.string(),
});

const AudioContent = z.object({
  type: z.literal('audio'),
  value: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  parseToText: z.boolean().default(true),
  parsedText: z.string().nullable().optional(),
});

const ImageContent = z.object({
  type: z.literal('image'),
  value: z.string(),
  filename: z.string(),
  mimetype: z.string(),
});

const VideoContent = z.object({
  type: z.literal('video'),
  value: z.string(),
  filename: z.string(),
  mimetype: z.string(),
});

const DocumentContent = z.object({
  type: z.literal('document'),
  value: z.string(),
  filename: z.string(),
  mimetype: z.string(),
});

// Define the content type union
export const ContentSchema = z.discriminatedUnion('type', [
  TextContent,
  AudioContent,
  ImageContent,
  VideoContent,
  DocumentContent,
]);

export type FinalContent = z.infer<typeof ContentSchema>;

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  contents: z.array(ContentSchema),
  replyToMessage: z.lazy(() => MessageSchema).nullable().optional(),
}).refine((msg) => msg.contents.filter((c) => c.type === 'text').length <= 1, {
  message: 'A message can only contain one text content.',
});

export type Message = z.infer<typeof MessageSchema>;

// --- Utility Constructors ---
export function textMsg(role: Role, value: string): Message {
  return MessageSchema.parse({ role, contents: [{ type: 'text', value }] });
}

export function audioMsg(
  role: Role,
  filename: string,
  value: string,
  mimetype: string
): Message {
  return MessageSchema.parse({
    role,
    contents: [{ type: 'audio', filename, value, mimetype }],
  });
}

export function imageMsg(
  role: Role,
  filename: string,
  value: string,
  mimetype: string
): Message {
  return MessageSchema.parse({
    role,
    contents: [{ type: 'image', filename, value, mimetype }],
  });
}

export function videoMsg(
  role: Role,
  filename: string,
  value: string,
  mimetype: string
): Message {
  return MessageSchema.parse({
    role,
    contents: [{ type: 'video', filename, value, mimetype }],
  });
}

export function documentMsg(
  role: Role,
  filename: string,
  value: string,
  mimetype: string
): Message {
  return MessageSchema.parse({
    role,
    contents: [{ type: 'document', filename, value, mimetype }],
  });
}

export function fileMsg(
  role: Role,
  filename: string,
  value: string,
  mimetype: string,
  caption?: string
): Message {
  const category = mimetype.split('/')[0];
  let msg: Message;
  switch (category) {
    case 'audio':
      msg = audioMsg(role, filename, value, mimetype);
      break;
    case 'image':
      msg = imageMsg(role, filename, value, mimetype);
      break;
    case 'video':
      msg = videoMsg(role, filename, value, mimetype);
      break;
    case 'application':
    case 'text':
      msg = documentMsg(role, filename, value, mimetype);
      break;
    default:
      throw new Error(`Message type not supported: ${mimetype}`);
  }
  if (caption) {
    msg.contents.push({ type: 'text', value: caption });
  }
  return msg;
}




