import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Ionicons } from '@expo/vector-icons';
import { useTranscript } from '../../context/TranscriptContext';

export default function CaptureScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const { transcript, setTranscript } = useTranscript();

  // --- DUMMY DATA FOR TESTING ---
  const dummyLectureText = "Quantum physics is the study of matter and energy at the most fundamental level. It aims to uncover the properties and behaviors of the very building blocks of nature. While many quantum experiments examine very small objects, such as electrons and photons, quantum phenomena are all around us, acting on every scale.";

  const simulateLecture = () => {
    setTranscript(dummyLectureText);
    Alert.alert("Success", "Dummy lecture data injected! You can now go to the AI Tutor tab.");
  };
  // ------------------------------

  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript || "");
  });

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));

  const handlePress = async () => {
    try {
      if (recognizing) {
        ExpoSpeechRecognitionModule.stop();
      } else {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (result.granted) {
          ExpoSpeechRecognitionModule.start({ lang: "en-US", interimResults: true });
        }
      }
    } catch (e) {
      Alert.alert("Native Module Error", "The Mic only works in a Development Build. Use 'Simulate' button for now.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capture Lecture</Text>
      
      <ScrollView style={styles.transcriptBox}>
        <Text style={styles.transcriptText}>
          {transcript || "No data yet. Use the Simulate button or Mic."}
        </Text>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.micButton, recognizing && styles.micActive]} 
          onPress={handlePress}
        >
          <Ionicons name={recognizing ? "stop" : "mic"} size={40} color="white" />
        </TouchableOpacity>

        {/* TEST BUTTON TO FEED DATA TO AI TUTOR */}
        <TouchableOpacity style={styles.simulateBtn} onPress={simulateLecture}>
          <Text style={styles.simulateText}>Simulate Lecture Data</Text>
        </TouchableOpacity>
        
        <Text style={styles.statusText}>
          {recognizing ? "Listening..." : "Tap mic to start or simulate data"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F', padding: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  transcriptBox: { flex: 1, backgroundColor: '#1A1D26', borderRadius: 20, padding: 20, marginBottom: 20 },
  transcriptText: { color: '#FFF', fontSize: 18, lineHeight: 26 },
  controls: { alignItems: 'center', marginBottom: 20 },
  micButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00E5FF', justifyContent: 'center', alignItems: 'center' },
  micActive: { backgroundColor: '#FF4B4B' },
  simulateBtn: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#00E5FF', borderRadius: 10 },
  simulateText: { color: '#00E5FF', fontWeight: 'bold' },
  statusText: { color: '#A0A0A0', marginTop: 15 }
});