import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "First name is required"
        }),
        lastName: string({
            required_error: "Last name is required"
        }),
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password is too short, should be at leat 6 characters"),
        passwordConfirmation: string({
            required_error: "Password confirmation is required"
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Password confirmation does not match",
        path: ["passwordConfirmation"]
    })
});

export const verifyUserSchema = object({
    params: object({
      id: string(),
      verificationCode: string(),
    }),
});


export type createUserInput = TypeOf<typeof createUserSchema>["body"];
export type verifyUserInput = TypeOf<typeof verifyUserSchema>["params"];