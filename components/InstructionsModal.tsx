import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X, MessageSquare } from 'lucide-react-native';
import { Order } from '@/types/order';

interface InstructionsModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ order, visible, onClose }: InstructionsModalProps) {
  if (!order) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <MessageSquare size={24} color="#10b981" />
            <Text style={styles.title}>Special Instructions</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order #{order.id}</Text>
          <Text style={styles.orderTime}>
            {order.timestamp.toLocaleString()}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              {order.specialInstructions || 'No special instructions provided.'}
            </Text>
          </View>

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.items.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.specialInstructions && (
                  <Text style={styles.itemInstructions}>
                    Note: {item.specialInstructions}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  orderInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#374151',
  },
  orderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 14,
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionsContainer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e5e7eb',
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  itemRow: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  itemInstructions: {
    fontSize: 14,
    color: '#f59e0b',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  doneButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});