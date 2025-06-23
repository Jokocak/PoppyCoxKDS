import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X, Filter, Calendar, Tag, Smartphone } from 'lucide-react-native';
import { OrderFilter } from '@/types/order';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: OrderFilter) => void;
  currentFilter: OrderFilter;
}

export default function FilterModal({ visible, onClose, onApply, currentFilter }: FilterModalProps) {
  const [filter, setFilter] = useState<OrderFilter>(currentFilter);

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    const resetFilter: OrderFilter = {
      status: 'All',
      priority: 'All',
      source: 'All',
    };
    setFilter(resetFilter);
  };

  const FilterSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const FilterOption = ({ 
    label, 
    value, 
    selected, 
    onSelect 
  }: { 
    label: string; 
    value: string; 
    selected: boolean; 
    onSelect: () => void; 
  }) => (
    <TouchableOpacity
      style={[styles.filterOption, selected && styles.filterOptionSelected]}
      onPress={onSelect}
    >
      <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
            <Filter size={24} color="#10b981" />
            <Text style={styles.title}>Filter Orders</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <FilterSection title="Status" icon={<Tag size={20} color="#9ca3af" />}>
            <View style={styles.optionsGrid}>
              <FilterOption
                label="All"
                value="All"
                selected={filter.status === 'All'}
                onSelect={() => setFilter({ ...filter, status: 'All' })}
              />
              <FilterOption
                label="In Progress"
                value="In Progress"
                selected={filter.status === 'In Progress'}
                onSelect={() => setFilter({ ...filter, status: 'In Progress' })}
              />
              <FilterOption
                label="Complete"
                value="Complete"
                selected={filter.status === 'Complete'}
                onSelect={() => setFilter({ ...filter, status: 'Complete' })}
              />
            </View>
          </FilterSection>

          <FilterSection title="Priority" icon={<Tag size={20} color="#9ca3af" />}>
            <View style={styles.optionsGrid}>
              <FilterOption
                label="All"
                value="All"
                selected={filter.priority === 'All'}
                onSelect={() => setFilter({ ...filter, priority: 'All' })}
              />
              <FilterOption
                label="High"
                value="High"
                selected={filter.priority === 'High'}
                onSelect={() => setFilter({ ...filter, priority: 'High' })}
              />
              <FilterOption
                label="Normal"
                value="Normal"
                selected={filter.priority === 'Normal'}
                onSelect={() => setFilter({ ...filter, priority: 'Normal' })}
              />
              <FilterOption
                label="Low"
                value="Low"
                selected={filter.priority === 'Low'}
                onSelect={() => setFilter({ ...filter, priority: 'Low' })}
              />
            </View>
          </FilterSection>

          <FilterSection title="Order Source" icon={<Smartphone size={20} color="#9ca3af" />}>
            <View style={styles.optionsGrid}>
              <FilterOption
                label="All"
                value="All"
                selected={filter.source === 'All'}
                onSelect={() => setFilter({ ...filter, source: 'All' })}
              />
              <FilterOption
                label="Mobile App"
                value="Mobile App"
                selected={filter.source === 'Mobile App'}
                onSelect={() => setFilter({ ...filter, source: 'Mobile App' })}
              />
              <FilterOption
                label="Website"
                value="Website"
                selected={filter.source === 'Website'}
                onSelect={() => setFilter({ ...filter, source: 'Website' })}
              />
              <FilterOption
                label="Clover POS"
                value="Clover POS"
                selected={filter.source === 'Clover POS'}
                onSelect={() => setFilter({ ...filter, source: 'Clover POS' })}
              />
            </View>
          </FilterSection>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#374151',
  },
  filterOptionSelected: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#e5e7eb',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#10b981',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});