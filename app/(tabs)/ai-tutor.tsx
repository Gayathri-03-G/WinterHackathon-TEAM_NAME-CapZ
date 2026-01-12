import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTranscript } from '../../context/TranscriptContext';

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

export default function AITutorScreen() {
  const { transcript } = useTranscript();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!transcript) return alert("Record a lecture first!");
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Summarize this transcript into notes: ${transcript}`;
      const result = await model.generateContent(prompt);
      setNotes(result.response.text());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveFile = async () => {
    const filename = "Notes.txt";
    if (Platform.OS === 'web') {
      const element = document.createElement("a");
      element.href = URL.createObjectURL(new Blob([notes], {type: 'text/plain'}));
      element.download = filename;
      element.click();
    } else {
      const uri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(uri, notes);
      await Sharing.shareAsync(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Tutor</Text>
      <ScrollView style={styles.box}>
        <Text style={styles.label}>TRANSCRIBED DATA:</Text>
        <Text style={{color: '#AAA'}}>{transcript || "Waiting for data..."}</Text>
        <View style={{height: 1, backgroundColor: '#333', marginVertical: 15}} />
        <Text style={styles.label}>AI NOTES:</Text>
        {loading ? <ActivityIndicator color="#00E5FF" /> : <Text style={{color: '#FFF'}}>{notes}</Text>}
      </ScrollView>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity style={styles.btn} onPress={handleGenerate}><Text>Generate</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#00E5FF'}]} onPress={saveFile}><Text>Save</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F', padding: 20, paddingTop: 60 },
  header: { fontSize: 28, color: '#00E5FF', fontWeight: 'bold' },
  box: { flex: 1, backgroundColor: '#1A1D26', padding: 20, borderRadius: 20, marginVertical: 20 },
  label: { color: '#00E5FF', fontSize: 12, fontWeight: 'bold' },
  btn: { flex: 1, backgroundColor: '#9D86FF', padding: 15, borderRadius: 10, alignItems: 'center' }
});