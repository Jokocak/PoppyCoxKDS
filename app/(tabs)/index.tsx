import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, Settings } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import CloverOrderCard from '@/components/CloverOrderCard';
import InstructionsModal from '@/components/InstructionsModal';
import ConnectionStatus from '@/components/ConnectionStatus';
import { Order } from '@/types/order';

export default function ActiveOrdersScreen() {
  const { isConnected, error, orders, markOrderComplete, unbumpOrder, reconnect } = useWebSocket('ws://localhost:3001');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const activeOrders = useMemo(() => 
    orders
      .filter(order => order.status === 'In Progress')
      .sort((a, b) => {
        // Sort by priority first (High > Normal > Low), then by timestamp
        const priorityOrder = { 'High': 3, 'Normal': 2, 'Low': 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp.getTime() - b.timestamp.getTime();
      }), 
    [orders]
  );

  const totalTickets = activeOrders.length;
  const avgFulfillmentTime = 12; // This would be calculated from actual data

  const hasCompletedOrders = useMemo(() => 
    orders.some(order => order.status === 'Complete'), 
    [orders]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    reconnect();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkComplete = (orderId: string) => {
    markOrderComplete(orderId);
  };

  const handleUnbump = () => {
    unbumpOrder();
  };

  const handleShowInstructions = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={styles.title}>EXPO • Active tickets</Text>
            <Text style={styles.subtitle}>Avg fulfillment time: {avgFulfillmentTime} minutes</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.ticketCount}>{totalTickets} Tickets</Text>
          <TouchableOpacity style={styles.completedButton}>
            <Text style={styles.completedButtonText}>Completed orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConnectionStatus 
        isConnected={isConnected} 
        error={error} 
        onReconnect={reconnect} 
      />

      {/* Orders Grid */}
      <ScrollView 
        style={styles.ordersContainer}
        contentContainerStyle={styles.ordersContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={['#10b981']}
          />
        }
      >
        {activeOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Active Orders</Text>
            <Text style={styles.emptyStateSubtitle}>
              All caught up! New orders will appear here automatically.
            </Text>
          </View>
        ) : (
          <View style={styles.ordersGrid}>
            {activeOrders.map((order) => (
              <CloverOrderCard
                key={order.id}
                order={order}
                onComplete={handleMarkComplete}
                onShowInstructions={handleShowInstructions}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <InstructionsModal
        order={selectedOrder}
        visible={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2d3748',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsButton: {
    padding: 8,
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#a0aec0',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  ticketCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  completedButton: {
    backgroundColor: '#4a5568',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  completedButtonText: {
    fontSize: 12,
    color: '#ffffff',
  },
  ordersContainer: {
    flex: 1,
  },
  ordersContent: {
    padding: 8,
    paddingBottom: 100,
  },
  ordersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
});