import React from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

const PDFTab: React.FC = () => {
  // For web, show a scrollable text view instead of WebView
  if (Platform.OS === 'web') {
    return (
      <ScrollView style={styles.container}>
        <ThemedView style={styles.webContent}>
          <ThemedText style={styles.title}>Data Structures & Algorithms</ThemedText>
          <ThemedText style={styles.subtitle}>Lecture Notes</ThemedText>

          <View style={styles.topic}>
            <ThemedText style={styles.topicTitle}>Binary Trees</ThemedText>
            <ThemedText style={styles.topicContent}>
              A binary tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child. It is used to implement binary search trees and binary heaps. Binary trees are fundamental in computer science for representing hierarchical data.
            </ThemedText>
          </View>

          <View style={styles.topic}>
            <ThemedText style={styles.topicTitle}>Tree Traversals</ThemedText>
            <ThemedText style={styles.topicContent}>
              Tree traversal refers to the process of visiting each node in a tree data structure exactly once. Common traversal methods include inorder, preorder, and postorder traversals. Inorder traversal visits left subtree, root, right subtree; preorder visits root, left, right; postorder visits left, right, root. These are essential for operations like searching, insertion, and deletion in trees.
            </ThemedText>
          </View>

          <View style={styles.topic}>
            <ThemedText style={styles.topicTitle}>AVL Trees</ThemedText>
            <ThemedText style={styles.topicContent}>
              An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees cannot be more than one for all nodes. It automatically performs rotations to maintain balance after insertions and deletions, ensuring O(log n) time complexity for operations. AVL trees are named after their inventors Adelson-Velsky and Landis.
            </ThemedText>
          </View>

          <ThemedText style={styles.footer}>
            CapZ AI - Data Structures & Algorithms Study Material
          </ThemedText>
        </ThemedView>
      </ScrollView>
    );
  }

  // For mobile, use WebView
  const WebView = require('react-native-webview').WebView;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Structures & Algorithms - Lecture Notes</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 100%;
                margin: 0;
                padding: 20px;
                background: #090A0F;
                color: #fff;
            }
            .header {
                text-align: center;
                color: #00E5FF;
                border-bottom: 2px solid #00E5FF;
                padding-bottom: 10px;
                margin-bottom: 30px;
            }
            .topic {
                background: #1A1D26;
                margin: 20px 0;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #333;
            }
            .topic h2 {
                color: #00E5FF;
                margin-top: 0;
            }
            .topic p {
                line-height: 1.6;
                color: #ccc;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                color: #888;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Data Structures & Algorithms</h1>
            <h2>Lecture Notes</h2>
        </div>

        <div class="topic">
            <h2>Binary Trees</h2>
            <p>A binary tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child. It is used to implement binary search trees and binary heaps. Binary trees are fundamental in computer science for representing hierarchical data.</p>
        </div>

        <div class="topic">
            <h2>Tree Traversals</h2>
            <p>Tree traversal refers to the process of visiting each node in a tree data structure exactly once. Common traversal methods include inorder, preorder, and postorder traversals. Inorder traversal visits left subtree, root, right subtree; preorder visits root, left, right; postorder visits left, right, root. These are essential for operations like searching, insertion, and deletion in trees.</p>
        </div>

        <div class="topic">
            <h2>AVL Trees</h2>
            <p>An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees cannot be more than one for all nodes. It automatically performs rotations to maintain balance after insertions and deletions, ensuring O(log n) time complexity for operations. AVL trees are named after their inventors Adelson-Velsky and Landis.</p>
        </div>

        <div class="footer">
            <p>CapZ AI - Data Structures & Algorithms Study Material</p>
        </div>
    </body>
    </html>
  `;

  return (
    <ThemedView style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090A0F',
  },
  webContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00E5FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  topic: {
    backgroundColor: '#1A1D26',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 15,
  },
  topicContent: {
    color: '#ccc',
    lineHeight: 24,
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 30,
  },
  webview: {
    flex: 1,
  },
});

export default PDFTab;