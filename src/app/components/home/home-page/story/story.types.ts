import { z } from 'zod';

export const createStoryRequestSchema = z.object({
  userId: z.string(),
  mediaUrl: z.string(),
  caption: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO']),
});

export const storySchema = z.object({
  id: z.string(),
  userId: z.string(),
  mediaUrl: z.string(),
  caption: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO']),
  expiresAt: z.string(),
  viewers: z.array(z.any()),
});

export const activeStoriesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mediaUrl: z.string(),
  caption: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO']),
  isActive: z.boolean(),
  createdAt:z.date().optional(),
  expiresAt:z.date(),
  user:z.object({
    id:z.string(),
    username:z.string(),
    profilePic: z.string().optional()
  })
})

export const viewerListSchema = z.object({
  storyId:z.string(),
  viewerId: z.string(),
  viewedAt:z.date(),
  viewer: z.object({
    id:z.string(),
    username:z.string(),
    profilePic: z.string().optional()
  }),
})

export type CreateStoryRequestSchema = z.infer<typeof createStoryRequestSchema>;
export type StorySchema = z.infer<typeof storySchema>;
export type ActiveStoriesSchema = z.infer<typeof activeStoriesSchema>;
export type ViewerListSchema = z.infer<typeof viewerListSchema>;