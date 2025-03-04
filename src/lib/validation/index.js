import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "minimun 8 character required" })
    .max(20, { message: "maximun 20 character allowed" }),
});

export const createPostSchema = z.object({
  caption: z
    .string().min(3, { message: "Caption must be at least 3 characters long" })
    .max(1000, { message: "Caption must be at most 1000 characters long" }),
  files: z.custom(),
  tags: z.string().min(3, { message: "Tags must be at least 3 characters long" }),
  location: z.string(),
});

export const createComment = z.object({
  content: z.string().min(1, {message: "comment should be atleast 1 character long"})
})
