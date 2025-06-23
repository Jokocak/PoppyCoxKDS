import { useEffect, useRef, useState } from 'react';
import { Order } from '@/types/order';

interface WebSocketMessage {
  type: 'newOrder' | 'orderUpdate' | 'orderComplete' | 'orderUnbump';
  data: Order;
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [orders, setOrders] = useState<Order[]>([]);

  const connect = () => {
    try {
      console.log('Attempting to connect to WebSocket...');
      
      setTimeout(() => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected');
        loadDemoOrders();
      }, 1000);

    } catch (err) {
      setError('Failed to connect to server');
      setIsConnected(false);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  };

  const loadDemoOrders = () => {
    const demoOrders: Order[] = [
      {
        id: 'ORD-001',
        orderNumber: '#4501',
        timestamp: new Date(Date.now() - 300000),
        status: 'In Progress',
        orderType: 'Pickup',
        items: [
          { 
            id: '1', 
            name: 'California Burrito', 
            quantity: 1,
            modifiers: ['Extra cheese', 'Extra sour cream']
          },
          { 
            id: '2', 
            name: 'Chicken Chimichanga', 
            quantity: 1 
          },
          { 
            id: '3', 
            name: 'Fish Taco', 
            quantity: 3,
            modifiers: ['No cabbage']
          },
          { 
            id: '4', 
            name: 'Margarita', 
            quantity: 3,
            modifiers: ['Blended']
          }
        ],
        priority: 'High',
        source: 'Mobile App',
        platform: 'Clover online',
        estimatedTime: 12,
        customerName: 'Kevin P.'
      },
      {
        id: 'ORD-002',
        orderNumber: '#4502',
        timestamp: new Date(Date.now() - 240000),
        status: 'In Progress',
        orderType: 'Pickup',
        items: [
          { 
            id: '5', 
            name: 'California Burrito', 
            quantity: 1 
          },
          { 
            id: '6', 
            name: 'Chicken Chimichanga', 
            quantity: 1 
          },
          { 
            id: '7', 
            name: 'Fish Taco', 
            quantity: 3,
            modifiers: ['No cabbage']
          },
          { 
            id: '8', 
            name: 'Margarita', 
            quantity: 3,
            modifiers: ['Blended']
          }
        ],
        priority: 'Normal',
        source: 'Website',
        platform: 'Grubhub',
        customerName: 'Cam H.'
      },
      {
        id: 'ORD-003',
        orderNumber: '#4503',
        timestamp: new Date(Date.now() - 180000),
        status: 'In Progress',
        orderType: 'Curbside',
        items: [
          { 
            id: '9', 
            name: 'Special', 
            quantity: 10,
            specialInstructions: 'Grey Honda HR-V'
          },
          { 
            id: '10', 
            name: 'Chips & Guacamole', 
            quantity: 1 
          },
          { 
            id: '11', 
            name: 'Fish Taco', 
            quantity: 3,
            modifiers: ['No cabbage']
          },
          { 
            id: '12', 
            name: 'Margarita', 
            quantity: 3,
            modifiers: ['Blended']
          }
        ],
        priority: 'Normal',
        source: 'Mobile App',
        platform: 'Clover online',
        customerName: 'Chaz B.'
      },
      {
        id: 'ORD-004',
        orderNumber: '#4504',
        timestamp: new Date(Date.now() - 120000),
        status: 'In Progress',
        orderType: 'Delivery',
        items: [
          { 
            id: '13', 
            name: 'California Burrito', 
            quantity: 1,
            modifiers: ['Extra cheese', 'Extra sour cream']
          },
          { 
            id: '14', 
            name: 'Chicken Chimichanga', 
            quantity: 1 
          },
          { 
            id: '15', 
            name: 'Fish Taco', 
            quantity: 3,
            modifiers: ['No cabbage']
          },
          { 
            id: '16', 
            name: 'Chips & Guacamole', 
            quantity: 1 
          }
        ],
        priority: 'Normal',
        source: 'Website',
        platform: 'Grubhub',
        customerName: 'Srushti K.'
      },
      {
        id: 'ORD-005',
        orderNumber: '#4505',
        timestamp: new Date(Date.now() - 60000),
        status: 'In Progress',
        orderType: 'Table',
        tableNumber: 'Table 7 - Main Din...',
        items: [
          { 
            id: '17', 
            name: 'Fish Taco', 
            quantity: 2,
            modifiers: ['Extra cabbage', 'Extra salsa']
          },
          { 
            id: '18', 
            name: 'Chicken Molé', 
            quantity: 1 
          },
          { 
            id: '19', 
            name: 'Birria Taco', 
            quantity: 4,
            modifiers: ['Extra consomé']
          },
          { 
            id: '20', 
            name: 'Al Pastor Taco', 
            quantity: 1 
          },
          { 
            id: '21', 
            name: 'Chips & Guacamole', 
            quantity: 1 
          }
        ],
        priority: 'Normal',
        source: 'Clover POS',
        customerName: 'Y876P23875360'
      },
      {
        id: 'ORD-006',
        orderNumber: '#4506',
        timestamp: new Date(Date.now() - 420000),
        status: 'In Progress',
        orderType: 'Delivery',
        items: [
          { 
            id: '22', 
            name: 'Special', 
            quantity: 1 
          },
          { 
            id: '23', 
            name: 'Quesadilla', 
            quantity: 3,
            modifiers: ['Kids']
          },
          { 
            id: '24', 
            name: '116 Burger', 
            quantity: 1,
            modifiers: ['Fries']
          },
          { 
            id: '25', 
            name: 'PB&J', 
            quantity: 1 
          },
          { 
            id: '26', 
            name: 'Granola', 
            quantity: 4,
            modifiers: ['Kids']
          }
        ],
        priority: 'Low',
        source: 'Mobile App',
        platform: 'Clover online',
        customerName: 'Samantha G.'
      },
      {
        id: 'ORD-007',
        orderNumber: '#4499',
        timestamp: new Date(Date.now() - 360000),
        status: 'In Progress',
        orderType: 'Dine In',
        items: [
          { 
            id: '27', 
            name: 'Al Pastor Taco', 
            quantity: 5 
          }
        ],
        priority: 'Normal',
        source: 'Clover POS',
        platform: 'In-store'
      },
      {
        id: 'ORD-008',
        orderNumber: '#4507',
        timestamp: new Date(Date.now() - 300000),
        status: 'In Progress',
        orderType: 'Pickup',
        items: [
          { 
            id: '28', 
            name: 'Special', 
            quantity: 1 
          },
          { 
            id: '29', 
            name: 'Quesadilla', 
            quantity: 2,
            modifiers: ['Kids']
          },
          { 
            id: '30', 
            name: 'PB&J', 
            quantity: 1 
          }
        ],
        priority: 'Normal',
        source: 'Website',
        platform: 'Grubhub',
        customerName: 'Tatiana G.'
      },
      {
        id: 'ORD-009',
        orderNumber: '#4508',
        timestamp: new Date(Date.now() - 240000),
        status: 'In Progress',
        orderType: 'Delivery',
        items: [
          { 
            id: '31', 
            name: 'Special', 
            quantity: 1 
          },
          { 
            id: '32', 
            name: 'Quesadilla', 
            quantity: 2,
            modifiers: ['Kids']
          },
          { 
            id: '33', 
            name: 'PB&J', 
            quantity: 1 
          },
          { 
            id: '34', 
            name: 'Granola', 
            quantity: 4,
            modifiers: ['Kids']
          }
        ],
        priority: 'Normal',
        source: 'Website',
        platform: 'Grubhub',
        customerName: 'Julianna S.'
      },
      {
        id: 'ORD-010',
        orderNumber: '#4509',
        timestamp: new Date(Date.now() - 180000),
        status: 'In Progress',
        orderType: 'Table',
        tableNumber: 'Table 6 - Outdoor',
        items: [
          { 
            id: '35', 
            name: 'Al Pastor Burrito', 
            quantity: 1,
            modifiers: ['Extra cheese', 'Extra sour cream']
          },
          { 
            id: '36', 
            name: 'Fish Taco', 
            quantity: 3,
            modifiers: ['No cabbage']
          }
        ],
        priority: 'Normal',
        source: 'Clover POS',
        customerName: 'M876D23646212'
      }
    ];
    
    setOrders(demoOrders);
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
  };

  const markOrderComplete = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Complete' as const }
          : order
      )
    );
  };

  const unbumpOrder = () => {
    const completedOrders = orders
      .filter(order => order.status === 'Complete')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (completedOrders.length > 0) {
      const orderToUnbump = completedOrders[0];
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderToUnbump.id 
            ? { ...order, status: 'In Progress' as const }
            : order
        )
      );
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    error,
    orders,
    markOrderComplete,
    unbumpOrder,
    reconnect: connect
  };
}