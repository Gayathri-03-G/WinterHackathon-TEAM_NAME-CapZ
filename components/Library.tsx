import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { sessions } from '../data/sessions';

interface LibraryProps {
  onSelectSession: (session: any) => void;
}

const Library: React.FC<LibraryProps> = ({ onSelectSession }) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Library</ThemedText>
      <ScrollView contentContainerStyle={styles.sessionsList}>
        {sessions.map(session => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionCard}
            onPress={() => onSelectSession(session)}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.sessionTitle}>{session.title}</ThemedText>
              <ThemedText style={styles.subject}>{session.subject}</ThemedText>
            </View>
            <View style={styles.cardDetails}>
              <ThemedText>{session.date}</ThemedText>
              <ThemedText>{session.duration}</ThemedText>
            </View>
            <View style={styles.cardStats}>
              <ThemedText>{session.notesCount} notes</ThemedText>
              <ThemedText>{session.diagramsCount} diagrams</ThemedText>
            </View>
            {session.deadline && <ThemedText style={styles.deadline}>{session.deadline}</ThemedText>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 20,
  },
  sessionsList: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    marginBottom: 10,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subject: {
    color: '#888',
    fontSize: 14,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deadline: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
    fontSize: 12,
  },
});

export default Library;