import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  // Add a fallback {} to prevent destructuring null
  const auth = useAuth();
  
  // If the context itself is missing (usually during dev/reload)
  if (!auth) return <ActivityIndicator />;

  const { user } = auth;

  // If we have the context but no user data yet
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#A0A0A0', fontSize: 16, marginTop: 10 }
});