import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Ionicons } from '@expo/vector-icons';

export default function CaptureScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Update transcript as the user speaks
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
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: true,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capture Lecture</Text>
      
      <ScrollView style={styles.transcriptBox}>
        <Text style={styles.transcriptText}>
          {transcript || "Your transcription will appear here..."}
        </Text>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.micButton, recognizing && styles.micActive]} 
          onPress={handlePress}
        >
          <Ionicons 
            name={recognizing ? "stop" : "mic"} 
            size={40} 
            color="white" 
          />
        </TouchableOpacity>
        <Text style={styles.statusText}>
          {recognizing ? "Listening..." : "Tap to start recording"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090A0F', padding: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  transcriptBox: { 
    flex: 1, 
    backgroundColor: '#1A1D26', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 30 
  },
  transcriptText: { color: '#FFF', fontSize: 18, lineHeight: 26 },
  controls: { alignItems: 'center', marginBottom: 40 },
  micButton: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#00E5FF', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  micActive: { backgroundColor: '#FF4B4B', shadowColor: '#FF4B4B' },
  statusText: { color: '#A0A0A0', marginTop: 15, fontSize: 16 }
});