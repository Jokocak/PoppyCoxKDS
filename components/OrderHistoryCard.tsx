import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, User, Smartphone, Globe, CreditCard, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { Order } from '@/types/order';

interface OrderHistoryCardProps {
  order: Order;
}

export default function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = () => {
    switch (order.source) {
      case 'Mobile App':
        return <Smartphone size={14} color="#9ca3af" />;
      case 'Website':
        return <Globe size={14} color="#9ca3af" />;
      case 'Clover POS':
        return <CreditCard size={14} color="#9ca3af" />;
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

  const getStatusIcon = () => {
    return order.status === 'Complete' 
      ? <CheckCircle size={16} color="#10b981" />
      : <Circle size={16} color="#f59e0b" />;
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { borderLeftColor: getPriorityColor() }]}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <View style={styles.timeInfo}>
            <Clock size={12} color="#9ca3af" />
            <Text style={styles.timeText}>{formatTime(order.timestamp)}</Text>
          </View>
        </View>
        
        <View style={styles.statusSection}>
          <View style={styles.statusInfo}>
            {getStatusIcon()}
            <Text style={[
              styles.statusText,
              { color: order.status === 'Complete' ? '#10b981' : '#f59e0b' }
            ]}>
              {order.status}
            </Text>
          </View>
          {order.customerName && (
            <View style={styles.customerInfo}>
              <User size={12} color="#9ca3af" />
              <Text style={styles.customerName}>{order.customerName}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.itemsList}>
          {order.items.slice(0, 3).map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
          {order.items.length > 3 && (
            <Text style={styles.moreItems}>
              +{order.items.length - 3} more items
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.leftInfo}>
          <View style={styles.sourceInfo}>
            {getSourceIcon()}
            <Text style={styles.sourceText}>{order.source}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{order.priority}</Text>
          </View>
        </View>
        
        <Text style={styles.totalItems}>{totalItems} items</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 16,
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
  statusSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerName: {
    fontSize: 11,
    color: '#9ca3af',
  },
  content: {
    marginBottom: 12,
  },
  itemsList: {
    gap: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    minWidth: 20,
  },
  itemName: {
    fontSize: 12,
    color: '#e5e7eb',
    flex: 1,
  },
  moreItems: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalItems: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
});