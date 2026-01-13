import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

interface ScheduleTabProps {
  session: any;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ session }) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Schedule</ThemedText>
      {session.schedule.map((item: any, index: number) => (
        <View key={index} style={[styles.taskItem, item.urgent && styles.urgent]}>
          <ThemedText style={styles.taskText}>{item.task}</ThemedText>
          <ThemedText style={styles.dateText}>{item.date}</ThemedText>
          {item.urgent && <ThemedText style={styles.urgentLabel}>Due soon</ThemedText>}
        </View>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
    marginBottom: 10,
  },
  urgent: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  taskText: {
    flex: 1,
    color: '#fff',
  },
  dateText: {
    color: '#ccc',
  },
  urgentLabel: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 12,
    marginLeft: 10,
  },
});

export default ScheduleTab;