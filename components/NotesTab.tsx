import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

interface NotesTabProps {
  session: any;
}

const NotesTab: React.FC<NotesTabProps> = ({ session }) => {
  const [selectedNote, setSelectedNote] = useState<{ title: string; content: string } | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([]);

  const openNote = (title: string, content: string) => {
    setSelectedNote({ title, content });
    setChatHistory([]);
    setChatInput("");
  };

  const askAssistant = async () => {
    if (!chatInput.trim()) return;

    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
    if (API_KEY === 'YOUR_GEMINI_API_KEY') {
      alert('Please add your Gemini API key to the .env file');
      return;
    }

    const userMessage = { q: chatInput, a: "Thinking..." };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput("");

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are a tutor for ${session.subject}. Answer questions only using the following notes. If the question is not covered in these notes, reply "Not covered in this lecture."

Notes:
${Object.entries(session.notes).map(([title, content]) => `${title}: ${content}`).join('\n\n')}

Question: ${chatInput}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { q: userMessage.q, a: answer };
        return newHistory;
      });
    } catch (error) {
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { q: userMessage.q, a: "Error: Could not reach AI assistant." };
        return newHistory;
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.notesContainer}>
        <ThemedText style={styles.header}>Lecture Notes</ThemedText>
        {Object.entries(session.notes).map(([title, content]) => (
          <TouchableOpacity
            key={title}
            style={styles.noteCard}
            onPress={() => openNote(title, content as string)}
          >
            <ThemedText style={styles.noteTitle}>{title}</ThemedText>
            <ThemedText style={styles.notePreview} numberOfLines={2}>
              {content as string}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL VIEW */}
      <Modal visible={!!selectedNote} animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setSelectedNote(null)} style={styles.backBtn}>
            <ThemedText style={{color:'#FFF'}}>← Back</ThemedText>
          </TouchableOpacity>
          <ScrollView style={{padding: 20}}>
            <ThemedText style={styles.modalTitle}>{selectedNote?.title}</ThemedText>
            <ThemedText style={styles.noteBody}>{selectedNote?.content}</ThemedText>
            <View style={styles.aiBox}>
              <ThemedText style={styles.aiTitle}>AI Tutor</ThemedText>
              {chatHistory.map((c, i) => (
                <View key={i} style={styles.chat}>
                  <ThemedText style={{color: '#00E5FF'}}>Q: {c.q}</ThemedText>
                  <ThemedText style={{color: '#FFF'}}>{c.a}</ThemedText>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask a doubt..."
              placeholderTextColor="#666"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity onPress={askAssistant} style={styles.send}>
              <ThemedText>Ask</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  notesContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteCard: {
    backgroundColor: '#1A1D26',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 10,
  },
  notePreview: {
    color: '#ccc',
    lineHeight: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  backBtn: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1A1D26',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noteBody: {
    color: '#AAA',
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 20,
  },
  aiBox: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: '#333',
    paddingTop: 20,
  },
  aiTitle: {
    color: '#00E5FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chat: {
    marginBottom: 15,
    backgroundColor: '#1A1D26',
    padding: 10,
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1A1D26',
  },
  input: {
    flex: 1,
    backgroundColor: '#252833',
    color: '#FFF',
    padding: 10,
    borderRadius: 8,
  },
  send: {
    backgroundColor: '#00E5FF',
    marginLeft: 10,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
});

export default NotesTab;