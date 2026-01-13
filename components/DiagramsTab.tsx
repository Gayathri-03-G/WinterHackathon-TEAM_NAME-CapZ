import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

const DiagramsTab: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Data Structure Diagrams</ThemedText>

        <View style={styles.diagram}>
          <ThemedText style={styles.diagramTitle}>Binary Tree</ThemedText>
          <ThemedText style={styles.ascii}>
            {`        5
       / \\
      3   8
     / \\   \\
    1   4   9`}
          </ThemedText>
          <ThemedText style={styles.description}>
            A binary tree where each node has at most two children.
          </ThemedText>
        </View>

        <View style={styles.diagram}>
          <ThemedText style={styles.diagramTitle}>AVL Tree (Balanced)</ThemedText>
          <ThemedText style={styles.ascii}>
            {`        5
       / \\
      3   8
     / \\   \\
    1   4   9`}
          </ThemedText>
          <ThemedText style={styles.description}>
            AVL tree maintains balance with height difference ≤ 1.
          </ThemedText>
        </View>

        <View style={styles.diagram}>
          <ThemedText style={styles.diagramTitle}>Tree Traversals</ThemedText>
          <ThemedText style={styles.ascii}>
            {`Preorder:  5 → 3 → 1 → 4 → 8 → 9
Inorder:   1 → 3 → 4 → 5 → 8 → 9
Postorder: 1 → 4 → 3 → 9 → 8 → 5`}
          </ThemedText>
          <ThemedText style={styles.description}>
            Different ways to traverse tree nodes.
          </ThemedText>
        </View>

        <View style={styles.diagram}>
          <ThemedText style={styles.diagramTitle}>Binary Search Tree</ThemedText>
          <ThemedText style={styles.ascii}>
            {`        8
       / \\
      3   10
     / \\   \\
    1   6   14
       / \\
      4   7`}
          </ThemedText>
          <ThemedText style={styles.description}>
            Left subtree &lt; root &lt; right subtree.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    textAlign: 'center',
    marginBottom: 30,
  },
  diagram: {
    backgroundColor: '#1A1D26',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  diagramTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 15,
  },
  ascii: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#252833',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DiagramsTab;