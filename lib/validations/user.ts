import { profile } from 'console';
import * as z from 'zod';

export const UserValidations = z.object({
    profile_photo: z.string().min(1),
    name: z.string().min(3, {message: "Minimum 3 Chars"}).max(30),
    username: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000)
})