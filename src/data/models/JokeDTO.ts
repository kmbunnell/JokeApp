import { z } from 'zod';
import type { JokeDTO } from '../../core/models/JokeDTO';

export const JokeDTOSchema = z.object({
  id: z.string(),
  question: z.string(),
  punchline: z.string(),
});

export const JokeDTOArraySchema = JokeDTOSchema.array();

// Compile-time check: Zod-inferred type must satisfy the core interface
type _Satisfies = z.infer<typeof JokeDTOSchema> extends JokeDTO ? true : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _check: _Satisfies = true;

export type { JokeDTO };
