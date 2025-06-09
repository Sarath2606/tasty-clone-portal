import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { User } from 'firebase/auth';
import {
  UserProfile,
  Address,
  Order,
  Notification,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  addAddress,
  addOrder,
  addNotification,
  getRecentOrders,
  getUnreadNotifications
} from '@/lib/firestore';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addNewAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  addNewOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  addNewNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  getLatestOrders: (limit?: number) => Promise<Order[]>;
  getUnreadUserNotifications: () => Promise<Notification[]>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      setError(null);
      
      if (user) {
        try {
          let userProfile = await getUserProfile(user.uid);
          
          if (!userProfile) {
            // Create new profile with all required fields
            userProfile = await createUserProfile(user.uid, {
              uid: user.uid, // Ensure uid is set
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              addresses: [],
              paymentMethods: [],
              orderHistory: [],
              notifications: [],
              preferences: {
                emailNotifications: true,
                pushNotifications: true,
                smsNotifications: false,
              }
            });
            toast.success('Profile created successfully');
          }
          
          setProfile(userProfile);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
          setError(errorMessage);
          toast.error(errorMessage);
          console.error('Profile initialization error:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update the profile in Firestore
      const updatedProfile = await updateUserProfile(currentUser.uid, data);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Failed to get updated profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNewAddress = async (address: Omit<Address, 'id'>) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      const newAddress = await addAddress(profile.uid, address);
      const updatedProfile = await getUserProfile(profile.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Address added successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add address';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addNewOrder = async (order: Omit<Order, 'id'>) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      const newOrder = await addOrder(profile.uid, order);
      const updatedProfile = await getUserProfile(profile.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Order added successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add order';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addNewNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      const newNotification = await addNotification(profile.uid, notification);
      const updatedProfile = await getUserProfile(profile.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Notification added successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add notification';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getLatestOrders = async (limit: number = 5) => {
    if (!profile) {
      toast.error('No profile found');
      return [];
    }

    try {
      return await getRecentOrders(profile.uid, limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get orders';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    }
  };

  const getUnreadUserNotifications = async () => {
    if (!profile) {
      toast.error('No profile found');
      return [];
    }

    try {
      return await getUnreadNotifications(profile.uid);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get notifications';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    }
  };

  const value = {
        profile,
        loading,
        error,
        updateProfile,
    addNewAddress,
    addNewOrder,
    addNewNotification,
    getLatestOrders,
    getUnreadUserNotifications
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}; 