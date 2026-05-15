import { z } from 'zod';

export const JokeDTOSchema = z.object({
  id: z.string(),
  question: z.string(),
  punchline: z.string(),
});

export const JokeDTOArraySchema = JokeDTOSchema.array();
export type JokeDTO = z.infer<typeof JokeDTOSchema>;
