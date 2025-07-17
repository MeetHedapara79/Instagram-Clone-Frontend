import { z } from "zod";

const newMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  timestamp: z.date(),
  conversationId: z.string(),
  readStatus: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  postId: z.string().optional().nullable()
});

export type NewMessageSchema = z.infer<typeof newMessageSchema>