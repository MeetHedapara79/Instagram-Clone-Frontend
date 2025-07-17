import z from 'zod';

export const createPostValidate = z.object({
    userId: z.string(),
    location: z.string().optional().nullable(),
    caption: z.string().optional().nullable(),
    content: z.string(),
    id:z.string(),
    likes:z.number().optional().default(0),
    comments:z.array(z.string()).optional().nullable().default([]),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
});

export type CreatePostValidate = z.infer<typeof createPostValidate>;