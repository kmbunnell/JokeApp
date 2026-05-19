import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './types';
import type { RootStackParamList } from './types';
import JokeScreen from '../screens/JokeScreen/JokeScreen';
import AnswerScreen from '../screens/AnswerScreen/AnswerScreen';
import { strings as answerStrings } from '../screens/AnswerScreen/strings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={Routes.Joke}>
      <Stack.Screen
        name={Routes.Joke}
        component={JokeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.Answer}
        component={AnswerScreen}
        options={{ title: answerStrings.navTitle }}
      />
    </Stack.Navigator>
  );
}
