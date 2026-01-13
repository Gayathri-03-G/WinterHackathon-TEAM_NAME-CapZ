import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from '../../context/AuthContext';

// 1. CONFIG: Your specific IDs
const GEN_AI = new GoogleGenerativeAI("AIzaSyDiaQE-L2SoSqSmTENEa0_41e2Cv4JzFTA");
const NOTES_FOLDER_ID = "1B5B4bsiUuunFMe6imTqsqKaCybx2Z_Bn"; 

export default function SmartLibrary() {
  const [notes, setNotes] = useState<{ id: string; name: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<{ id: string; name: string } | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 2. FETCH THE LIST OF NOTES
  const fetchFiles = async () => {
    // If user.accessToken is missing, the list will be blank!
    if (!user?.accessToken) return;
    
    setLoading(true);
    try {
      // Query filters for your specific folder and hides trashed files
      const q = encodeURIComponent(`'${NOTES_FOLDER_ID}' in parents and trashed = false`);
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id, name)`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Drive API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        Alert.alert("Permission Error", "Please log out and log in again to grant Drive access.");
      } else {
        setNotes(data.files || []);
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, [user?.accessToken]);

  // 3. READ NOTE CONTENT
  const openNote = async (file: { id: string; name: string }) => {
    setSelectedNote(file);
    setNoteContent("Loading your notes...");
    setChatHistory([]); // Clear old chat
    
    try {
      // Converts Google Doc to plain text so AI can read it
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      setNoteContent(text || "File appears to be empty or not a readable format.");
    } catch (e) {
      setNoteContent("Could not read file. Check if it is a Google Doc.");
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setNotes([]);
    setSelectedNote(null);
    setNoteContent("");
    setChatHistory([]);
    setChatInput("");
  };

  // 4. AI CHAT LOGIC
  const askAssistant = async () => {
    if (!chatInput) return;
    const model = GEN_AI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Use these lecture notes: "${noteContent}" to answer: ${chatInput}`;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setChatHistory([...chatHistory, { q: chatInput, a: response.text() }]);
      setChatInput("");
    } catch (e) {
      Alert.alert("AI Error", "Failed to connect to Gemini.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Lecture Library</Text>
        <TouchableOpacity onPress={fetchFiles}>
          <Text style={styles.refreshBtn}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00E5FF" />
      ) : (
        <ScrollView>
          {notes.map(note => (
            <TouchableOpacity key={note.id} style={styles.card} onPress={() => openNote(note)}>
              <Text style={styles.noteTitle}>{note.name}</Text>
              <Text style={styles.subText}>Study Guide Available</Text>
            </TouchableOpacity>
          ))}
          {notes.length === 0 && !loading && (
            <Text style={styles.empty}>No notes found in your folder yet.</Text>
          )}
        </ScrollView>
      )}

      {/* READING VIEW & AI TUTOR */}
      <Modal visible={!!selectedNote} animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setSelectedNote(null)} style={styles.backBtn}>
            <Text style={styles.backText}>← Back to Library</Text>
          </TouchableOpacity>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedNote?.name}</Text>
            <Text style={styles.noteBody}>{noteContent}</Text>
            
            <View style={styles.aiBox}>
              <Text style={styles.aiHeader}>Chat with AI Tutor</Text>
              {chatHistory.map((c, i) => (
                <View key={i} style={styles.chatBubble}>
                  <Text style={styles.userQ}>Q: {c.q}</Text>
                  <Text style={styles.aiA}>{c.a}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput 
              style={styles.input} 
              placeholder="Ask a question about this note..." 
              placeholderTextColor="#666" 
              value={chatInput} 
              onChangeText={setChatInput} 
            />
            <TouchableOpacity onPress={askAssistant} style={styles.sendBtn}>
              <Text style={styles.sendText}>Ask AI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F', padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  header: { fontSize: 28, color: '#FFF', fontWeight: 'bold' },
  refreshBtn: { color: '#00E5FF', fontWeight: '600', marginTop: 10 },
  card: { backgroundColor: '#1A1D26', padding: 20, borderRadius: 15, marginBottom: 12 },
  noteTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  subText: { color: '#666', fontSize: 12, marginTop: 5 },
  empty: { color: '#444', textAlign: 'center', marginTop: 50 },
  modal: { flex: 1, backgroundColor: '#090A0F' },
  backBtn: { padding: 20, paddingTop: 50, backgroundColor: '#1A1D26' },
  backText: { color: '#00E5FF', fontWeight: 'bold' },
  modalContent: { padding: 20 },
  modalTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  noteBody: { color: '#CCC', lineHeight: 24, fontSize: 15 },
  aiBox: { marginTop: 40, borderTopWidth: 1, borderColor: '#333', paddingTop: 20 },
  aiHeader: { color: '#9D86FF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  chatBubble: { backgroundColor: '#1A1D26', padding: 15, borderRadius: 12, marginBottom: 10 },
  userQ: { color: '#00E5FF', fontWeight: 'bold', marginBottom: 5 },
  aiA: { color: '#FFF', fontSize: 14 },
  inputArea: { flexDirection: 'row', padding: 20, backgroundColor: '#1A1D26' },
  input: { flex: 1, backgroundColor: '#252833', color: '#FFF', padding: 12, borderRadius: 10 },
  sendBtn: { backgroundColor: '#00E5FF', marginLeft: 10, paddingHorizontal: 20, borderRadius: 10, justifyContent: 'center' },
  sendText: { fontWeight: 'bold', color: '#000' }
});
