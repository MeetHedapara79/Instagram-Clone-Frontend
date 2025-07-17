import { z } from "zod";

export const UserSchema = z.object({
  password: z.string(),
  username: z.string(),
  id: z.string(),
  email_phone: z.string(),
  recoveryCode: z.string().nullable().optional(),
  profilePic: z.string().nullable().optional(),
  followers: z.array(z.string()).nullable().optional(),
  following: z.array(z.string()).nullable().optional(),
  bio: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;
