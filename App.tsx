import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { JokeRepositoryProvider } from './src/presentation/context/JokeRepositoryContext';
import { LocalJokeRepository } from './src/data/repositories/LocalJokeRepository';

function App() {
  const [jokeRepository] = useState(() => new LocalJokeRepository());

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <JokeRepositoryProvider repository={jokeRepository}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </JokeRepositoryProvider>
    </SafeAreaProvider>
  );
}

export default App;
