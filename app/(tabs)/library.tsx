import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Library from '../../components/Library';
import Session from '../../components/Session';

export default function LibraryScreen() {
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <View style={styles.container}>
      {selectedSession ? (
        <Session session={selectedSession} onBack={() => setSelectedSession(null)} />
      ) : (
        <Library onSelectSession={setSelectedSession} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
});