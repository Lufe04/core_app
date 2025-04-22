
import { Stack } from "expo-router";
import React from 'react';
export default function RootLayout() {
  return (
      <Stack
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="bieneBasicos"/>
        <Stack.Screen name="habitos"/>
        <Stack.Screen name="felicidad"/>
        <Stack.Screen name="virtudesCardinales"/>
      </Stack>
  )
}