import { CommentsProvider } from "@/context/CommentsContext";
import { Stack } from "expo-router";
import React from 'react';
export default function RootLayout() {
  return (
    <CommentsProvider>
      <Stack
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="matarRuiseñor"/>
        <Stack.Screen name="señorAnillo"/>
      </Stack>
      </CommentsProvider>
  )
}