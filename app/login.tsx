import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  SafeAreaView, Platform, Alert 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  // 1. Google Auth Request Configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID', // Replace with your actual iOS ID
    androidClientId: '208790099010-qksfpanfog3v3dksk0nbm0mbjdkf4cdn.apps.googleusercontent.com',
    webClientId: '208790099010-52o46hlj77tfscp4q1dpofqj954n82am.apps.googleusercontent.com',
    // 🛡️ THIS SCOPE IS REQUIRED TO SEE DRIVE FILES
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  // 2. Handle the Google Response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      Alert.alert("Login Error", "Could not connect to Google.");
    }
  }, [response]);

  // 3. Fetch Profile Info & SAVE EVERYTHING to Context
  async function fetchUserInfo(token: string) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();
      
      // ✅ THE CRITICAL FIX: Save the token along with user info
      // This allows the Library screen to use user.accessToken
      setUser({
        ...userInfo,
        accessToken: token, 
      }); 

      console.log("User logged in with Drive permissions");
      router.replace('/(tabs)');
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      Alert.alert("Error", "Failed to get user profile.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.loginContentMobile}>
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
            <Text style={styles.featureItem}>•  Smart doubt clearing with AI</Text>
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
            By continuing, you grant CapZ permission to access your study folder.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F' },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  loginContentMobile: { alignItems: 'center', width: '100%' },
  welcomeText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  brandText: { fontSize: 48, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
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