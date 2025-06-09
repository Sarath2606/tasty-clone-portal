import React, { useEffect, useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Order, Notification } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

export const ProfileTest: React.FC = () => {
  const {
    profile,
    loading,
    error,
    updateProfile,
    addNewAddress,
    addNewOrder,
    addNewNotification,
    getLatestOrders,
    getUnreadUserNotifications
  } = useUserProfile();

  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (profile) {
        const recentOrders = await getLatestOrders(3);
        const unreadNotifications = await getUnreadUserNotifications();
        setOrders(recentOrders);
        setNotifications(unreadNotifications);
      }
    };
    loadData();
  }, [profile, getLatestOrders, getUnreadUserNotifications]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  const handleUpdateProfile = async () => {
    await updateProfile({
      displayName: 'Test User ' + new Date().toLocaleTimeString()
    });
  };

  const handleAddAddress = async () => {
    await addNewAddress({
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'Test Country',
      isDefault: false
    });
  };

  const handleAddOrder = async () => {
    const now = Timestamp.now();
    await addNewOrder({
      createdAt: now,
      updatedAt: now,
      items: [{
        id: crypto.randomUUID(),
        name: 'Test Item',
        quantity: 1,
        price: 9.99
      }],
      total: 9.99,
      status: 'pending'
    });
  };

  const handleAddNotification = async () => {
    await addNewNotification({
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info',
      read: false
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Test</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Profile Info</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleUpdateProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile Name
        </button>

        <button
          onClick={handleAddAddress}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Add Test Address
        </button>

        <button
          onClick={handleAddOrder}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2"
        >
          Add Test Order
        </button>

        <button
          onClick={handleAddNotification}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
        >
          Add Test Notification
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(orders, null, 2)}
        </pre>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Unread Notifications</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(notifications, null, 2)}
        </pre>
      </div>
    </div>
  );
}; 