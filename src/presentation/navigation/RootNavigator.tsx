import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import JokeScreen from '../screens/JokeScreen/JokeScreen';
import AnswerScreen from '../screens/AnswerScreen/AnswerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Joke">
      <Stack.Screen
        name="Joke"
        component={JokeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Answer" component={AnswerScreen} />
    </Stack.Navigator>
  );
}
