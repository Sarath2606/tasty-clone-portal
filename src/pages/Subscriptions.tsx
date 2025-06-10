import { useState } from 'react';
import { SubscriptionList } from '@/components/SubscriptionList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Subscriptions</h1>
        <Link to="/plans">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
          <TabsTrigger value="past">Past Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <SubscriptionList filter="active" />
        </TabsContent>
        
        <TabsContent value="past">
          <SubscriptionList filter="past" />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 