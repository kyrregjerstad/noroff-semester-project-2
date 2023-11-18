import { z } from 'zod';
import { singleListingSchema } from './listing';

export const singleUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable(),
  credits: z.number(),
  wins: z.array(z.string()),
  listings: z.array(singleListingSchema),
  _count: z.object({
    listings: z.number(),
  }),
});

export type User = z.infer<typeof singleUserSchema>;

export const allUsersSchema = z.array(singleUserSchema);