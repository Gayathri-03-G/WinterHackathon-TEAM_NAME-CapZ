import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import ChatBot from '../../components/ChatBot';
import dsNotes from '../../data/dsNotes.json';

export default function DSNotesScreen() {
  const { subject, notes } = dsNotes;

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.notesContainer} contentContainerStyle={styles.notesContent}>
        <ThemedText style={styles.title}>{subject}</ThemedText>
        {Object.entries(notes).map(([topic, content]) => (
          <View key={topic} style={styles.noteSection}>
            <ThemedText style={styles.topic}>{topic}</ThemedText>
            <ThemedText style={styles.content}>{content}</ThemedText>
          </View>
        ))}
      </ScrollView>
      <View style={styles.chatbotContainer}>
        <ChatBot subject={subject} notes={notes} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  notesContainer: {
    flex: 1,
  },
  notesContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  noteSection: {
    marginBottom: 20,
  },
  topic: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  chatbotContainer: {
    height: 300, // Fixed height for the chatbot panel
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
});