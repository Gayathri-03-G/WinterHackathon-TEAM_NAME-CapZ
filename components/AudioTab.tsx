import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

interface AudioTabProps {
  session: any;
}

const AudioTab: React.FC<AudioTabProps> = ({ session }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [Speech, setSpeech] = useState<any>(null);

  useEffect(() => {
    // Dynamically import expo-speech only on native platforms
    if (Platform.OS !== 'web') {
      import('expo-speech').then((speechModule) => {
        setSpeech(speechModule);
        setSpeechAvailable(true);
      }).catch(() => {
        setSpeechAvailable(false);
      });
    }
  }, []);

  const toggleSpeech = async () => {
    if (!speechAvailable || !Speech) {
      alert('Text-to-speech is not available on this platform');
      return;
    }

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      const notesText = Object.entries(session.notes)
        .map(([title, content]) => `${title}. ${content}`)
        .join('. ');

      Speech.speak(notesText, {
        rate: speed,
        pitch: 1,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
      });
      setIsPlaying(true);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying && Speech) {
      Speech.stop();
      setIsPlaying(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Full Recording</ThemedText>
      <ThemedText style={styles.duration}>Duration: {session.duration}</ThemedText>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.playButton} onPress={toggleSpeech}>
          <ThemedText style={styles.playText}>{isPlaying ? 'Pause' : 'Play'}</ThemedText>
        </TouchableOpacity>
        <View style={styles.speedControls}>
          {[0.75, 1, 1.5, 2].map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.speedButton, speed === s && styles.activeSpeed]}
              onPress={() => changeSpeed(s)}
            >
              <ThemedText style={styles.speedText}>{s}x</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 10,
  },
  duration: {
    color: '#ccc',
    marginBottom: 30,
  },
  controls: {
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  playText: {
    color: '#fff',
    fontSize: 18,
  },
  speedControls: {
    flexDirection: 'row',
    gap: 10,
  },
  speedButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  activeSpeed: {
    backgroundColor: '#007bff',
  },
  speedText: {
    color: '#fff',
  },
});

export default AudioTab;