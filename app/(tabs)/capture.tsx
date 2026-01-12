import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Ionicons } from '@expo/vector-icons';
import { useTranscript } from '../../context/TranscriptContext';

export default function CaptureScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const { transcript, setTranscript } = useTranscript();

  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript || "");
  });

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));

  const handlePress = async () => {
    if (recognizing) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (result.granted) {
        ExpoSpeechRecognitionModule.start({ lang: "en-US", interimResults: true });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capture Lecture</Text>
      <ScrollView style={styles.transcriptBox}>
        <Text style={styles.transcriptText}>
          {transcript || "Speak to start capturing data..."}
        </Text>
      </ScrollView>
      <TouchableOpacity style={[styles.micButton, recognizing && styles.micActive]} onPress={handlePress}>
        <Ionicons name={recognizing ? "stop" : "mic"} size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F', padding: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  transcriptBox: { flex: 1, backgroundColor: '#1A1D26', borderRadius: 20, padding: 20, marginVertical: 20 },
  transcriptText: { color: '#FFF', fontSize: 18 },
  micButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00E5FF', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  micActive: { backgroundColor: '#FF4B4B' }
});