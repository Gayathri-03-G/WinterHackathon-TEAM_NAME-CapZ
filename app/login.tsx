import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '208790099010-qksfpanfog3v3dksk0nbm0mbjdkf4cdn.apps.googleusercontent.com', // Same as Android for now
    androidClientId: '208790099010-qksfpanfog3v3dksk0nbm0mbjdkf4cdn.apps.googleusercontent.com',
    webClientId: '208790099010-52o46hlj77tfscp4q1dpofqj954n82am.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive.readonly', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      fetchUserInfo(response.authentication?.accessToken);
    } else if (response?.type === 'error') {
      console.error('OAuth Error:', response.error);
      alert('Login failed. Please check your Google account settings.');
    }
  }, [response]);

  async function fetchUserInfo(token: any) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const userInfo = await res.json();
      setUser({
        ...userInfo,
        accessToken: token
      });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error fetching user info:', error);
      alert('Failed to get user information. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={Platform.OS === 'web' ? styles.webWrapper : styles.content}>
        
        {/* Only show this extra side-panel on Web */}
        {Platform.OS === 'web' && (
          <View style={styles.webArtSide}>
            <Text style={styles.webArtTitle}>Elevate Your Learning</Text>
            <Text style={styles.webArtSub}>Join thousands of students using CapZ AI to master their lectures.</Text>
          </View>
        )}

        <View style={Platform.OS === 'web' ? styles.loginCardWeb : styles.loginContentMobile}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#090A0F' 
  },
  // WEB SPECIFIC WRAPPER
  webWrapper: {
    flex: 1,
    flexDirection: 'row', // Side-by-side on web
  },
  webArtSide: {
    flex: 1,
    backgroundColor: '#1A1D26',
    justifyContent: 'center',
    padding: 60,
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  webArtTitle: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  webArtSub: { fontSize: 18, color: '#A0A0A0', lineHeight: 28 },
  loginCardWeb: {
    width: 500, // Fixed width so it looks like a card on web
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  // MOBILE & ORIGINAL STYLES
  content: { 
    flex: 1, 
    padding: 30, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loginContentMobile: {
    alignItems: 'center',
    width: '100%',
  },
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
  buttonText: { fontWeight: '600', fontSize: 16, color: '#000' },
  footerText: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 30 }
});