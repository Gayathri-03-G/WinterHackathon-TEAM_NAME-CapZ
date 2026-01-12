import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

// 1. IMPORT BOTH PROVIDERS
import { AuthProvider, useAuth } from '../context/AuthContext'; 
import { TranscriptProvider } from '../context/TranscriptContext'; // <-- Add this

function NavigationLogic() {
  const [isAppReady, setAppReady] = useState(false);
  const { user } = useAuth(); 
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAppReady) return;
    const inTabsGroup = segments[0] === '(tabs)';
    const isLoggedIn = !!user;

    if (!isLoggedIn && inTabsGroup) {
      router.replace('/login');
    } else if (isLoggedIn && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [isAppReady, user, segments]);

  if (!isAppReady) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('../assets/images/splash-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#00E5FF" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

// 2. WRAP EVERYTHING IN NESTED PROVIDERS
export default function RootLayout() {
  return (
    <AuthProvider>
      <TranscriptProvider>
        <NavigationLogic />
      </TranscriptProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});