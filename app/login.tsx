import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Ensures the browser window closes correctly after login
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth(); // Moved inside the component

  // Initialize the Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: '208790099010-52o46hlj77tfscp4q1dpofqj954n82am.apps.googleusercontent.com',
  });

  // Main Effect to handle the Google response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        console.log('Login Success, fetching user info...');
        fetchUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  // Function to get Name, Email, and Photo from Google
  async function fetchUserInfo(token: string) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();
      
      setUser(userInfo); // Save Google data to global context
      router.replace('/(tabs)'); // Navigate to Home
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.brandText}>
          <Text style={{ color: '#00E5FF' }}>CapZ</Text> AI
        </Text>
        
        <Text style={styles.description}>
          Capture lectures, generate notes, and study smarter with AI
        </Text>

        <View style={styles.features}>
          <Text style={styles.featureItem}>•  Live lecture transcription</Text>
          <Text style={styles.featureItem}>•  AI-generated study materials</Text>
          <Text style={styles.featureItem}>•  Smart scheduling & reminders</Text>
        </View>

        <TouchableOpacity 
          style={[styles.googleButton, !request && { opacity: 0.6 }]} 
          disabled={!request}
          onPress={() => promptAsync()} 
        >
          <AntDesign name="google" size={20} color="black" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F' },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  brandText: { fontSize: 48, fontWeight: 'bold', color: '#9D86FF', marginBottom: 20 },
  description: { color: '#A0A0A0', textAlign: 'center', fontSize: 16, marginBottom: 40, lineHeight: 24 },
  features: { alignSelf: 'flex-start', marginBottom: 60, gap: 15 },
  featureItem: { color: '#FFF', fontSize: 16 },
  googleButton: { 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    width: '100%', 
    padding: 18, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10 
  },
  buttonText: { fontWeight: '600', fontSize: 16 },
  footerText: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 30 }
});