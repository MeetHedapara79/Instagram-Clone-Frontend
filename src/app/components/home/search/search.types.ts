import { z } from "zod";

const PostSchema = z.object({
  id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.string(),
  caption: z.string().nullable(),
  location: z.string().nullable(),
  content: z.string(),
  likes: z.number().default(0),
});

const searchedUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  profilePic: z.string().nullable(),
  Post: PostSchema.nullable(),
});

export type SearchedUserSchema = z.infer<typeof searchedUserSchema>;
