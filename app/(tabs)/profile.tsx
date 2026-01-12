import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null); // Clear global state
    router.replace('/login'); // Redirect to login
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>No user data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Account</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.picture }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Settings Links */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color="#A0A0A0" />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#A0A0A0" />
            <Text style={styles.menuText}>Privacy & Security</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF4B4B" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F' },
  content: { padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 30, marginTop: 20 },
  profileCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1D26', 
    padding: 20, 
    borderRadius: 16, 
    gap: 15,
    marginBottom: 30
  },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#00E5FF' },
  name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  email: { color: '#A0A0A0', fontSize: 14 },
  section: { marginBottom: 30 },
  sectionLabel: { color: '#666', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, marginLeft: 5 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1D26', 
    padding: 15, 
    borderRadius: 12, 
    gap: 15, 
    marginBottom: 10 
  },
  menuText: { color: '#FFF', fontSize: 16 },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    padding: 15, 
    marginTop: 20 
  },
  logoutText: { color: '#FF4B4B', fontWeight: 'bold', fontSize: 16 }
});