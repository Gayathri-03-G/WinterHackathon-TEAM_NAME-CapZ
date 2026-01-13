import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import NotesTab from './NotesTab';
import DiagramsTab from './DiagramsTab';
import AudioTab from './AudioTab';
import ScheduleTab from './ScheduleTab';
import PDFTab from './PDFTab';

interface SessionProps {
  session: any;
  onBack: () => void;
}

const Session: React.FC<SessionProps> = ({ session, onBack }) => {
  const [activeTab, setActiveTab] = useState('notes');

  const renderTab = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesTab session={session} />;
      case 'diagrams':
        return <DiagramsTab />;
      case 'audio':
        return <AudioTab session={session} />;
      case 'schedule':
        return <ScheduleTab session={session} />;
      case 'pdf':
        return <PDFTab />;
      default:
        return <NotesTab session={session} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ThemedText style={styles.backButton}>← Back</ThemedText>
        </TouchableOpacity>
        <View style={styles.sessionInfo}>
          <ThemedText style={styles.sessionTitle}>{session.title}</ThemedText>
          <ThemedText style={styles.sessionMeta}>{session.subject} • {session.date}</ThemedText>
        </View>
      </View>
      <View style={styles.tabs}>
        {['notes', 'diagrams', 'audio', 'schedule', 'pdf'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabContent}>
        {renderTab()}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    fontSize: 18,
    color: '#00E5FF',
    marginRight: 15,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionMeta: {
    color: '#888',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00E5FF',
  },
  tabText: {
    color: '#888',
  },
  activeTabText: {
    color: '#00E5FF',
  },
  tabContent: {
    flex: 1,
  },
});

export default Session;