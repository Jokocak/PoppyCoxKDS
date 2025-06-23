import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, User, Smartphone, Globe, CreditCard, Plus, Check } from 'lucide-react-native';
import { Order } from '@/types/order';

interface OrderCardProps {
  order: Order;
  onComplete: (orderId: string) => void;
  onShowInstructions: (order: Order) => void;
}

export default function OrderCard({ order, onComplete, onShowInstructions }: OrderCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSourceIcon = () => {
    switch (order.source) {
      case 'Mobile App':
        return <Smartphone size={16} color="#9ca3af" />;
      case 'Website':
        return <Globe size={16} color="#9ca3af" />;
      case 'Clover POS':
        return <CreditCard size={16} color="#9ca3af" />;
      default:
        return null;
    }
  };

  const getPriorityColor = () => {
    switch (order.priority) {
      case 'High':
        return '#ef4444';
      case 'Normal':
        return '#10b981';
      case 'Low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { borderLeftColor: getPriorityColor() }]}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <View style={styles.timeInfo}>
            <Clock size={14} color="#9ca3af" />
            <Text style={styles.timeText}>{formatTime(order.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.metadata}>
          {order.customerName && (
            <View style={styles.customerInfo}>
              <User size={14} color="#9ca3af" />
              <Text style={styles.customerName}>{order.customerName}</Text>
            </View>
          )}
          <View style={styles.sourceInfo}>
            {getSourceIcon()}
            <Text style={styles.sourceText}>{order.source}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.itemsList}>
          {order.items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.totalItems}>{totalItems} items total</Text>
          {order.estimatedTime && (
            <Text style={styles.estimatedTime}>~{order.estimatedTime} min</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          {order.specialInstructions && (
            <TouchableOpacity 
              style={styles.instructionsButton}
              onPress={() => onShowInstructions(order)}
            >
              <Plus size={16} color="#3b82f6" />
              <Text style={styles.instructionsButtonText}>Instructions</Text>
            </TouchableOpacity>
          )}
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{order.priority}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => onComplete(order.id)}
        >
          <Check size={18} color="#ffffff" />
          <Text style={styles.completeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  metadata: {
    alignItems: 'flex-end',
    gap: 4,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerName: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  content: {
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
    minWidth: 24,
  },
  itemName: {
    fontSize: 14,
    color: '#e5e7eb',
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
  },
  totalItems: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  estimatedTime: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  instructionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  instructionsButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});