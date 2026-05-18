export const Routes = {
  Joke: 'Joke',
  Answer: 'Answer',
} as const;

export type RootStackParamList = {
  [Routes.Joke]: undefined;
  [Routes.Answer]: { jokeId: string };
};
