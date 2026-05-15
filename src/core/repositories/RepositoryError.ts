export type RepositoryError = {
  kind: 'not_found' | 'parse_error' | 'unavailable';
  message: string;
};
