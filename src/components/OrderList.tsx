import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { Order } from '@/types/order';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Clock, MapPin, CreditCard, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface OrderListProps {
  filter?: 'active' | 'past' | 'all' | 'delivered' | 'cancelled';
  searchQuery?: string;
  sortBy?: string;
}

export const OrderList = ({ filter = 'active', searchQuery = '', sortBy = 'date-desc' }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          estimatedDeliveryTime: doc.data().estimatedDeliveryTime?.toDate(),
        })) as Order[];
        
        // Filter orders based on status
        let filteredOrders = ordersData;
        if (filter !== 'all') {
          filteredOrders = ordersData.filter(order => {
            if (filter === 'active') {
              return ['pending', 'preparing', 'ready'].includes(order.status);
            } else if (filter === 'delivered') {
              return order.status === 'delivered';
            } else if (filter === 'cancelled') {
              return order.status === 'cancelled';
            } else {
              return ['delivered', 'cancelled'].includes(order.status);
            }
          });
        }

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(query) ||
            order.items.some(item => item.name.toLowerCase().includes(query)) ||
            (order.deliveryAddress && order.deliveryAddress.toLowerCase().includes(query))
          );
        }

        // Apply sorting
        filteredOrders.sort((a, b) => {
          switch (sortBy) {
            case 'date-asc':
              return a.createdAt.getTime() - b.createdAt.getTime();
            case 'date-desc':
              return b.createdAt.getTime() - a.createdAt.getTime();
            case 'amount-asc':
              return a.totalAmount - b.totalAmount;
            case 'amount-desc':
              return b.totalAmount - a.totalAmount;
            default:
              return 0;
          }
        });
        
        setOrders(filteredOrders);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, filter, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Package className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500 text-lg">
            {filter === 'active' 
              ? 'No active orders found' 
              : filter === 'all'
              ? 'No orders found'
              : `No ${filter} orders found`}
          </p>
          <p className="text-gray-400 text-sm">
            {filter === 'active'
              ? 'Your active orders will appear here'
              : 'Your order history will appear here'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                Order #{order.id.slice(-6)}
              </CardTitle>
              <Badge className={statusColors[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {format(order.createdAt, 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              
              {order.deliveryAddress && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4" />
                <span>{order.paymentMethod}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 