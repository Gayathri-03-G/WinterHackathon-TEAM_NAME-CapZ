import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

// 1. IMPORT THE PROVIDER AND THE HOOK
import { AuthProvider, useAuth } from '../context/AuthContext'; 

function NavigationLogic() {
  const [isAppReady, setAppReady] = useState(false);
  const { user } = useAuth(); // Now this won't be null because it's inside AuthProvider
  const segments = useSegments();
  const router = useRouter();

  // Handle Initial Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Redirection Logic
  useEffect(() => {
    if (!isAppReady) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const isLoggedIn = !!user;

    if (!isLoggedIn && inTabsGroup) {
      // Not logged in but trying to access home? Go to login.
      router.replace('/login');
    } else if (isLoggedIn && !inTabsGroup) {
      // Logged in but on login page? Go to home.
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

// 2. THE MAIN EXPORT WRAPS EVERYTHING IN THE PROVIDER
export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationLogic />
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