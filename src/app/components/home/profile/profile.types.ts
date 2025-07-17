import z from "zod";

const tagedPostList = z.object({
    postId:z.string(),
    userId:z.string(),
    taggedAt: z.date().optional(),
    post:z.object({
        id:z.string(),
        content:z.string(),
        likes:z.number().default(0),
        user: z.object({
            id: z.string(),
            username: z.string(),
            profilePic: z.string().nullable(),
        })
    })
})

export type TagedPostList = z.infer<typeof tagedPostList>;