import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function GameModeSelection() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.heading}>Which type game Will You Play</ThemedText>
        <ThemedText style={styles.description}>Get ready for an exciting adventure!</ThemedText>
        <Link
          href="/human-vs-human"
          style={styles.link}
          asChild
        >
          <ThemedView style={styles.linkButton}>
            <ThemedText style={styles.linkText}>Human vs Human</ThemedText>
          </ThemedView>
        </Link>
        <Link
          href="/human-vs-ai-macan"
          style={styles.link}
          asChild
        >
          <ThemedView style={styles.linkButton}>
            <ThemedText style={styles.linkText}>Human vs AI (Macan)</ThemedText>
          </ThemedView>
        </Link>
        <Link
          href="/human-vs-ai-uwong"
          style={styles.link}
          asChild
        >
          <ThemedView style={styles.linkButton}>
            <ThemedText style={styles.linkText}>Human vs AI (Uwong)</ThemedText>
          </ThemedView>
        </Link>
        <Link
          href="/ai-vs-ai"
          style={styles.link}
          asChild
        >
          <ThemedView style={styles.linkButton}>
            <ThemedText style={styles.linkText}>AI vs AI</ThemedText>
          </ThemedView>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white', // Assuming white background, adjust with ThemedView if needed
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // for Android shadow
    alignItems: 'center',
  },
  heading: {
    marginBottom: 16,
    color: '#2563eb', // blue-600 from tailwind
  },
  description: {
    fontSize: 18,
    marginBottom: 16,
    color: '#4b5563', // gray-600 from tailwind
    textAlign: 'center',
  },
  link: {
    marginBottom: 12,
  },
  linkButton: {
    backgroundColor: '#2563eb', // blue-600 from tailwind
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // for Android shadow
  },
  linkText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default GameModeSelection;
