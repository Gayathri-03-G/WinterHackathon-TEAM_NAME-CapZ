import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#00E5FF',
      tabBarStyle: { backgroundColor: '#0F1117' },
      headerShown: false 
    }}>
      {/* Your existing tabs */}
      <Tabs.Screen name="index" options={{ title: 'Library', tabBarIcon: ({color}) => <Ionicons name="library" size={24} color={color} /> }} />
      
      {/* Add the Capture Tab here */}
      <Tabs.Screen 
        name="capture" 
        options={{ 
          title: 'Capture', 
          tabBarIcon: ({color}) => <Ionicons name="mic" size={24} color={color} /> 
        }} 
      />


      <Tabs.Screen name="library" options={{ title: 'Study', tabBarIcon: ({color}) => <Ionicons name="book" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}