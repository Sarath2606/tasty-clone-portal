import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Subscription } from '@/types/subscription';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
};

interface SubscriptionListProps {
  filter?: 'active' | 'past';
}

export const SubscriptionList = ({ filter = 'active' }: SubscriptionListProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', user.uid),
      orderBy('startDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const subscriptionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate(),
          lastPaymentDate: doc.data().lastPaymentDate?.toDate(),
          nextPaymentDate: doc.data().nextPaymentDate?.toDate(),
        })) as Subscription[];
        
        // Filter subscriptions based on status
        const filteredSubscriptions = subscriptionsData.filter(sub => {
          if (filter === 'active') {
            return sub.status === 'active';
          } else {
            return ['cancelled', 'expired'].includes(sub.status);
          }
        });
        
        setSubscriptions(filteredSubscriptions);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to load subscriptions. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, filter]);

  const handleAutoRenewToggle = async (subscription: Subscription) => {
    try {
      // Update auto-renew status in Firestore
      const subscriptionRef = doc(db, 'subscriptions', subscription.id);
      await updateDoc(subscriptionRef, {
        autoRenew: !subscription.autoRenew
      });
      
      toast.success(
        subscription.autoRenew 
          ? 'Auto-renewal disabled' 
          : 'Auto-renewal enabled'
      );
    } catch (error) {
      console.error('Error updating auto-renew:', error);
      toast.error('Failed to update auto-renewal status');
    }
  };

  const handleCancelSubscription = async (subscription: Subscription) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const subscriptionRef = doc(db, 'subscriptions', subscription.id);
      await updateDoc(subscriptionRef, {
        status: 'cancelled',
        autoRenew: false
      });
      
      toast.success('Subscription cancelled successfully');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
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

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500 text-lg">
            {filter === 'active' 
              ? 'No active subscriptions found' 
              : 'No past subscriptions found'}
          </p>
          <p className="text-gray-400 text-sm">
            {filter === 'active'
              ? 'Your active subscriptions will appear here'
              : 'Your subscription history will appear here'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {subscription.plan.name}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {subscription.plan.description}
                </p>
              </div>
              <Badge className={statusColors[subscription.status]}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p>{format(subscription.startDate, 'MMM d, yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p>{format(subscription.endDate, 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCard className="w-4 h-4" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p>{subscription.paymentMethod}</p>
                </div>
              </div>

              {subscription.status === 'active' && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={subscription.autoRenew}
                      onCheckedChange={() => handleAutoRenewToggle(subscription)}
                    />
                    <span className="text-sm">Auto-renew</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelSubscription(subscription)}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              )}

              {subscription.nextPaymentDate && subscription.status === 'active' && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <p>
                    Next payment: {format(subscription.nextPaymentDate, 'MMM d, yyyy')}
                  </p>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold">${subscription.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 