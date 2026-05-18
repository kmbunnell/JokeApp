import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { JokeRepositoryProvider } from './src/presentation/context/JokeRepositoryContext';
import { LocalJokeRepository } from './src/data/repositories/LocalJokeRepository';

const jokeRepository = new LocalJokeRepository();

function App() {
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
