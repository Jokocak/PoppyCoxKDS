import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react-native';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  onReconnect: () => void;
}

export default function ConnectionStatus({ isConnected, error, onReconnect }: ConnectionStatusProps) {
  if (isConnected && !error) {
    return (
      <View style={[styles.container, styles.connected]}>
        <Wifi size={16} color="#10b981" />
        <Text style={styles.connectedText}>Connected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.disconnected]}>
      <WifiOff size={16} color="#ef4444" />
      <Text style={styles.errorText}>
        {error || 'Connection lost'}
      </Text>
      <TouchableOpacity style={styles.reconnectButton} onPress={onReconnect}>
        <RefreshCw size={14} color="#ffffff" />
        <Text style={styles.reconnectText}>Reconnect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    gap: 8,
  },
  connected: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
    borderWidth: 1,
  },
  disconnected: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  connectedText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    flex: 1,
  },
  reconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reconnectText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});