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
const _check: _Satisfies = true;
void _check;

export type { JokeDTO };
