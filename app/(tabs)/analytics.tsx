import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Package, Users, Smartphone, Globe, CreditCard } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function AnalyticsScreen() {
  const { isConnected, error, orders, reconnect } = useWebSocket('ws://localhost:3001');

  const analytics = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayOrders = orders.filter(order => order.timestamp >= todayStart);
    const completedToday = todayOrders.filter(order => order.status === 'Complete');
    const inProgressToday = todayOrders.filter(order => order.status === 'In Progress');
    
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const sourceBreakdown = orders.reduce((acc, order) => {
      acc[order.source] = (acc[order.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityBreakdown = orders.reduce((acc, order) => {
      acc[order.priority] = (acc[order.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgItemsPerOrder = orders.length > 0 
      ? (totalItems / orders.length).toFixed(1) 
      : '0';

    const completionRate = todayOrders.length > 0 
      ? ((completedToday.length / todayOrders.length) * 100).toFixed(1)
      : '0';

    return {
      todayOrders: todayOrders.length,
      completedToday: completedToday.length,
      inProgressToday: inProgressToday.length,
      totalItems,
      avgItemsPerOrder,
      completionRate,
      sourceBreakdown,
      priorityBreakdown,
    };
  }, [orders]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = '#10b981' 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: React.ReactNode; 
    color?: string; 
  }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
          {React.cloneElement(icon as React.ReactElement, { size: 20, color })}
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const BreakdownCard = ({ 
    title, 
    data, 
    icon 
  }: { 
    title: string; 
    data: Record<string, number>; 
    icon: React.ReactNode; 
  }) => (
    <View style={styles.breakdownCard}>
      <View style={styles.breakdownHeader}>
        {icon}
        <Text style={styles.breakdownTitle}>{title}</Text>
      </View>
      <View style={styles.breakdownContent}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{key}</Text>
            <Text style={styles.breakdownValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Kitchen Analytics</Text>
          <Text style={styles.subtitle}>Performance Overview</Text>
        </View>
      </View>

      <ConnectionStatus 
        isConnected={isConnected} 
        error={error} 
        onReconnect={reconnect} 
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <StatCard
            title="Today's Orders"
            value={analytics.todayOrders}
            subtitle="Total orders received"
            icon={<Package />}
            color="#10b981"
          />
          <StatCard
            title="Completed"
            value={analytics.completedToday}
            subtitle="Orders finished"
            icon={<TrendingUp />}
            color="#059669"
          />
          <StatCard
            title="In Progress"
            value={analytics.inProgressToday}
            subtitle="Currently cooking"
            icon={<Clock />}
            color="#f59e0b"
          />
          <StatCard
            title="Total Items"
            value={analytics.totalItems}
            subtitle="All time"
            icon={<Package />}
            color="#3b82f6"
          />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analytics.avgItemsPerOrder}</Text>
            <Text style={styles.metricLabel}>Avg Items/Order</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#10b981' }]}>
              {analytics.completionRate}%
            </Text>
            <Text style={styles.metricLabel}>Completion Rate</Text>
          </View>
        </View>

        <BreakdownCard
          title="Orders by Source"
          data={analytics.sourceBreakdown}
          icon={<Smartphone size={20} color="#9ca3af" />}
        />

        <BreakdownCard
          title="Orders by Priority"
          data={analytics.priorityBreakdown}
          icon={<TrendingUp size={20} color="#9ca3af" />}
        />

        <View style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Users size={20} color="#10b981" />
            <Text style={styles.insightsTitle}>Quick Insights</Text>
          </View>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Most orders come from {Object.entries(analytics.sourceBreakdown)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Average order contains {analytics.avgItemsPerOrder} items
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                {analytics.completionRate}% completion rate for today
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statIcon: {
    padding: 6,
    borderRadius: 6,
  },
  statTitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  breakdownContent: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  insightsCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  insightBullet: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  insightText: {
    fontSize: 14,
    color: '#e5e7eb',
    flex: 1,
    lineHeight: 20,
  },
});