import { Stack } from 'expo-router';

export default function ManageBlogsLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#061415' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My blogs' }} />
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}