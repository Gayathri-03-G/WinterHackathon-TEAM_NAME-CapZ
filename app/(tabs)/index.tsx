import React, { useState, useEffect } from 'react';
import { 
  View, Text, Modal, ScrollView, TextInput, 
  TouchableOpacity, StyleSheet, ActivityIndicator, Alert 
} from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from '../../context/AuthContext'; 

// 1. CONFIG: Add your IDs here
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

  // 2. FETCH FILE LIST
  const fetchFiles = async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    try {
      const q = encodeURIComponent(`'${NOTES_FOLDER_ID}' in parents and trashed = false`);
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id, name)`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      const data = await response.json();
      
      if (data.error) {
        Alert.alert("Permission Error", "Please logout and login again to grant Drive access.");
      } else {
        setNotes(data.files || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, [user]);

  // 3. READ FILE CONTENT
  const openNote = async (file: { id: string; name: string }) => {
    setSelectedNote(file);
    setNoteContent("Reading content...");
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      const text = await response.text();
      setNoteContent(text);
    } catch (e) {
      setNoteContent("Could not read file. Make sure it's a Google Doc.");
    }
  };

  // 4. AI CHAT
  const askAssistant = async () => {
    if (!chatInput) return;
    const model = GEN_AI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Lecture Notes: "${noteContent}" \n Student Question: ${chatInput}`;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setChatHistory([...chatHistory, { q: chatInput, a: response.text() }]);
      setChatInput("");
    } catch (e) {
      Alert.alert("AI Error", "Failed to reach Gemini.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Notes</Text>
        <TouchableOpacity onPress={fetchFiles}><Text style={{color: '#CCFF00'}}>Refresh</Text></TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#CCFF00" />
      ) : (
        <ScrollView>
          {notes.map(note => (
            <TouchableOpacity key={note.id} style={styles.card} onPress={() => openNote(note)}>
              <Text style={styles.noteTitle}>{note.name}</Text>
            </TouchableOpacity>
          ))}
          {notes.length === 0 && <Text style={styles.empty}>No files found in folder.</Text>}
        </ScrollView>
      )}

      {/* MODAL VIEW */}
      <Modal visible={!!selectedNote} animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setSelectedNote(null)} style={styles.backBtn}><Text style={{color:'#FFF'}}>← Back</Text></TouchableOpacity>
          <ScrollView style={{padding: 20}}>
            <Text style={styles.modalTitle}>{selectedNote?.name}</Text>
            <Text style={styles.noteBody}>{noteContent}</Text>
            <View style={styles.aiBox}>
              <Text style={styles.aiTitle}>AI Tutor</Text>
              {chatHistory.map((c, i) => (
                <View key={i} style={styles.chat}><Text style={{color: '#CCFF00'}}>Q: {c.q}</Text><Text style={{color: '#FFF'}}>{c.a}</Text></View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="Ask a doubt..." placeholderTextColor="#666" value={chatInput} onChangeText={setChatInput} />
            <TouchableOpacity onPress={askAssistant} style={styles.send}><Text>Ask</Text></TouchableOpacity>
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
  card: { backgroundColor: '#1A1D26', padding: 20, borderRadius: 12, marginBottom: 10 },
  noteTitle: { color: '#FFF', fontSize: 16 },
  empty: { color: '#444', textAlign: 'center', marginTop: 40 },
  modal: { flex: 1, backgroundColor: '#090A0F' },
  backBtn: { padding: 20, paddingTop: 50, backgroundColor: '#1A1D26' },
  modalTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  noteBody: { color: '#AAA', lineHeight: 22 },
  aiBox: { marginTop: 30, borderTopWidth: 1, borderColor: '#333', paddingTop: 20 },
  aiTitle: { color: '#9D86FF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  chat: { marginBottom: 15, backgroundColor: '#1A1D26', padding: 10, borderRadius: 8 },
  inputRow: { flexDirection: 'row', padding: 20, backgroundColor: '#1A1D26' },
  input: { flex: 1, backgroundColor: '#252833', color: '#FFF', padding: 10, borderRadius: 8 },
  send: { backgroundColor: '#CCFF00', marginLeft: 10, padding: 10, borderRadius: 8, justifyContent: 'center' }
});