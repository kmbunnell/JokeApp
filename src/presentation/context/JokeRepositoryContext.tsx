import React, { createContext, useContext } from 'react';
import type { IJokeRepository } from '../../core/repositories/IJokeRepository';

const JokeRepositoryContext = createContext<IJokeRepository | null>(null);

export function useJokeRepository(): IJokeRepository {
  const repo = useContext(JokeRepositoryContext);
  if (repo === null) {
    throw new Error('useJokeRepository must be used within JokeRepositoryProvider');
  }
  return repo;
}

interface JokeRepositoryProviderProps {
  repository: IJokeRepository;
  children: React.ReactNode;
}

export function JokeRepositoryProvider({
  repository,
  children,
}: JokeRepositoryProviderProps) {
  return (
    <JokeRepositoryContext.Provider value={repository}>
      {children}
    </JokeRepositoryContext.Provider>
  );
}
