import { useState } from 'react';
import { OrderList } from '@/components/OrderList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <OrderList filter="active" />
        </TabsContent>
        
        <TabsContent value="past">
          <OrderList filter="past" />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 