import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Archive, Search } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import OrderHistoryCard from '@/components/OrderHistoryCard';
import FilterModal from '@/components/FilterModal';
import ConnectionStatus from '@/components/ConnectionStatus';
import { Order, OrderFilter } from '@/types/order';

export default function OrderHistoryScreen() {
  const { isConnected, error, orders, reconnect } = useWebSocket('ws://localhost:3001');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<OrderFilter>({
    status: 'All',
    priority: 'All',
    source: 'All',
  });

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply status filter
    if (filter.status && filter.status !== 'All') {
      filtered = filtered.filter(order => order.status === filter.status);
    }

    // Apply priority filter
    if (filter.priority && filter.priority !== 'All') {
      filtered = filtered.filter(order => order.priority === filter.priority);
    }

    // Apply source filter
    if (filter.source && filter.source !== 'All') {
      filtered = filtered.filter(order => order.source === filter.source);
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [orders, filter]);

  const orderStats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter(order => order.status === 'In Progress').length;
    const completed = orders.filter(order => order.status === 'Complete').length;
    
    return { total, inProgress, completed };
  }, [orders]);

  const onRefresh = async () => {
    setRefreshing(true);
    reconnect();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleApplyFilter = (newFilter: OrderFilter) => {
    setFilter(newFilter);
  };

  const isFilterActive = () => {
    return filter.status !== 'All' || 
           filter.priority !== 'All' || 
           filter.source !== 'All';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Order History</Text>
          <Text style={styles.subtitle}>
            {filteredOrders.length} of {orders.length} orders
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, isFilterActive() && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={isFilterActive() ? "#10b981" : "#9ca3af"} />
        </TouchableOpacity>
      </View>

      <ConnectionStatus 
        isConnected={isConnected} 
        error={error} 
        onReconnect={reconnect} 
      />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{orderStats.total}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>{orderStats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{orderStats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {isFilterActive() && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersText}>
            Filters: {filter.status !== 'All' ? filter.status : ''} 
            {filter.priority !== 'All' ? ` • ${filter.priority} Priority` : ''} 
            {filter.source !== 'All' ? ` • ${filter.source}` : ''}
          </Text>
          <TouchableOpacity 
            onPress={() => setFilter({ status: 'All', priority: 'All', source: 'All' })}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.ordersList}
        contentContainerStyle={styles.ordersListContent}
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
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Archive size={48} color="#6b7280" />
            <Text style={styles.emptyStateTitle}>
              {orders.length === 0 ? 'No Orders Yet' : 'No Matching Orders'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {orders.length === 0 
                ? 'Order history will appear here once orders are placed.'
                : 'Try adjusting your filters to see more results.'
              }
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))
        )}
      </ScrollView>

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilter}
        currentFilter={filter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  filterButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#064e3b',
    borderBottomWidth: 1,
    borderBottomColor: '#10b981',
  },
  activeFiltersText: {
    fontSize: 12,
    color: '#10b981',
    flex: 1,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    padding: 16,
    paddingBottom: 100,
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
    color: '#9ca3af',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});