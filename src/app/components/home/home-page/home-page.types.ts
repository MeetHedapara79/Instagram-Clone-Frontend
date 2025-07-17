import z from 'zod';

export const followUserSchema = z.object({
  followerId: z.string(),
  followingId: z.string(),
});

export const followingPostsSchema = z.object({
  userId: z.string(),
  location: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  content: z.string(),
  id: z.string(),
  likes: z.number().optional().default(0),
  comments: z.array(z.string()).optional().nullable().default([]),
  user:z.object({
    id: z.string(),
    username: z.string(),
    profilePic: z.string().optional().nullable(),
  }),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export const likeDataListSchema = z.object({
  postId:z.string(),
  userId:z.string(),
  likedAt: z.date()
})

export const getTagedPostsByPostIdSchema = z.object({
    userId: z.string(),
    postId: z.string(),
    user: z.object({
        id: z.string(),
        username: z.string(),
        profilePic: z.string().nullable(),
    }),
})

export type FollowUserSchema = z.infer<typeof followUserSchema>;
export type FollowingPostsSchema = z.infer<typeof followingPostsSchema>;
export type LikeDataListSchema = z.infer<typeof likeDataListSchema>;
export type GetTagedPostsByPostIdSchema = z.infer<typeof getTagedPostsByPostIdSchema>;
