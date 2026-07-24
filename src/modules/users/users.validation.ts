import { z } from 'zod';

export const updateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  skillLevel: z.string().optional(),
  preferredSports: z.array(z.string()).optional(), // Array of sport IDs
});
