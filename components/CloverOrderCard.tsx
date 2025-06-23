import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MoveHorizontal as MoreHorizontal, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Order } from '@/types/order';

interface CloverOrderCardProps {
  order: Order;
  onComplete: (orderId: string) => void;
  onShowInstructions?: (order: Order) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CloverOrderCard({ order, onComplete, onShowInstructions }: CloverOrderCardProps) {
  const getOrderTypeColor = () => {
    switch (order.orderType) {
      case 'Pickup':
        return order.status === 'Complete' ? '#4ade80' : '#ef4444'; // Green when complete, red when active
      case 'Delivery':
        return '#f59e0b'; // Orange
      case 'Curbside':
        return '#eab308'; // Yellow
      case 'Dine In':
        return '#6b7280'; // Gray
      case 'Table':
        return '#6b7280'; // Gray
      default:
        return '#6b7280';
    }
  };

  const formatEstimatedTime = () => {
    if (!order.estimatedTime) return '';
    const now = new Date();
    const orderTime = new Date(order.timestamp);
    const elapsedMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    return `Avg fulfillment time: ${order.estimatedTime} minutes`;
  };

  const getDisplayTitle = () => {
    if (order.orderType === 'Table' && order.tableNumber) {
      return order.tableNumber;
    }
    return order.orderType;
  };

  const getSubtitle = () => {
    if (order.orderType === 'Dine In') {
      return order.platform || 'In-store';
    }
    if (order.orderType === 'Table') {
      return order.customerName || '';
    }
    return `${order.platform || order.source}${order.customerName ? ` • ${order.customerName}` : ''}`;
  };

  const hasSpecialInstructions = order.specialInstructions || 
    order.items.some(item => item.specialInstructions || (item.modifiers && item.modifiers.length > 0));

  // Calculate responsive card width
  const getCardWidth = () => {
    if (screenWidth > 1200) return (screenWidth - 64) / 4 - 16; // 4 columns on large screens
    if (screenWidth > 900) return (screenWidth - 48) / 3 - 16; // 3 columns on medium screens
    if (screenWidth > 600) return (screenWidth - 32) / 2 - 16; // 2 columns on small tablets
    return screenWidth - 32; // 1 column on phones
  };

  return (
    <View style={[styles.container, { backgroundColor: getOrderTypeColor(), width: getCardWidth() }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderType}>{getDisplayTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Estimated Time */}
      {order.estimatedTime && (
        <Text style={styles.estimatedTime}>{formatEstimatedTime()}</Text>
      )}

      {/* Order Number */}
      {order.orderNumber && (
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
      )}

      {/* Special Instructions Note */}
      {hasSpecialInstructions && order.items.some(item => item.specialInstructions) && (
        <View style={styles.specialNote}>
          <Text style={styles.specialNoteText}>
            "{order.items.find(item => item.specialInstructions)?.specialInstructions}"
          </Text>
        </View>
      )}

      {/* Items List */}
      <View style={styles.itemsList}>
        {order.items.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemHeader}>
              <View style={styles.itemLeft}>
                {order.status === 'Complete' && (
                  <CheckCircle size={16} color="#ffffff" style={styles.checkIcon} />
                )}
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
            </View>
            {item.modifiers && item.modifiers.length > 0 && (
              <View style={styles.modifiers}>
                {item.modifiers.map((modifier, modIndex) => (
                  <Text key={modIndex} style={styles.modifierText}>• {modifier}</Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Complete Button */}
      {order.status === 'In Progress' && (
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => onComplete(order.id)}
        >
          <Text style={styles.completeButtonText}>Mark Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    margin: 8,
    minHeight: 200,
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
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  orderType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  moreButton: {
    padding: 4,
  },
  estimatedTime: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  specialNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 6,
    marginBottom: 8,
  },
  specialNoteText: {
    fontSize: 11,
    color: '#ffffff',
    fontStyle: 'italic',
  },
  itemsList: {
    flex: 1,
    marginBottom: 12,
  },
  itemRow: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkIcon: {
    marginRight: 6,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
    minWidth: 20,
  },
  itemName: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  modifiers: {
    marginLeft: 44,
    marginTop: 2,
  },
  modifierText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 16,
  },
  completeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});