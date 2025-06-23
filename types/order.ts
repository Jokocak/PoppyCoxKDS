export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  specialInstructions?: string;
  modifiers?: string[];
}

export interface Order {
  id: string;
  timestamp: Date;
  status: 'In Progress' | 'Complete';
  items: OrderItem[];
  specialInstructions?: string;
  priority: 'High' | 'Normal' | 'Low';
  source: 'Clover POS' | 'Mobile App' | 'Website';
  orderType: 'Pickup' | 'Delivery' | 'Dine In' | 'Curbside' | 'Table';
  estimatedTime?: number; // in minutes
  customerName?: string;
  tableNumber?: string;
  orderNumber?: string;
  platform?: string;
}

export interface OrderFilter {
  status?: 'In Progress' | 'Complete' | 'All';
  dateFrom?: Date;
  dateTo?: Date;
  priority?: 'High' | 'Normal' | 'Low' | 'All';
  source?: 'Clover POS' | 'Mobile App' | 'Website' | 'All';
  orderType?: 'Pickup' | 'Delivery' | 'Dine In' | 'Curbside' | 'Table' | 'All';
}