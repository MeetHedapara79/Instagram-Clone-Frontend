import z from "zod"

export const signinUserValidate = z.object({
    username:z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export const resetPasswordValidate = z.object({
    username:z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    recoveryCode: z.string().optional().nullable(),
})

export const registerUserValidate = z.object({
    emailphone: z.string(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    username:z.string(),
    recoveryCode: z.string().optional().nullable(),
})

export const forgotPasswordValidate = z.object({
    username:z.string(),
    recoveryCode: z.string().optional().nullable(),
})

export type ForgotPasswordValidate = z.infer<typeof forgotPasswordValidate>;

export type RegisterUserValidate = z.infer<typeof registerUserValidate>;

export type ResetPasswordValidate = z.infer<typeof resetPasswordValidate>;

export type SigninUserValidate = z.infer<typeof signinUserValidate>;