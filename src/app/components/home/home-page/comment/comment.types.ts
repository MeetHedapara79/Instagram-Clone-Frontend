import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  profilePic: z.string().url(),
});

const PostSchema = z.object({
  id: z.string(),
  likes: z.number().default(0),
  content: z.string(),
  userId: z.string(),
  caption: z.string().optional().nullable(),
});


const commentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string(),
  content: z.string(),
  parentId: z.string().nullable(),
  createdAt: z.date().optional(),
  user: UserSchema,
  post:PostSchema,
  replies: z.array(z.any()),
  hideReplies:z.boolean().optional()
});

export type CommentSchema = z.infer<typeof commentSchema>;