import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, db } from '@/config/firebase';
import { User } from 'firebase/auth';
import {
  UserProfile,
  Address,
  Order,
  Notification,
  PaymentMethod,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  addAddress,
  addOrder,
  addNotification,
  getRecentOrders,
  getUnreadNotifications,
  UserPreferences
} from '@/lib/firestore';
import { toast } from 'sonner';
import { Timestamp, doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addNewAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  addNewOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  addNewNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  getLatestOrders: (limit?: number) => Promise<Order[]>;
  getUnreadUserNotifications: () => Promise<Notification[]>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (paymentId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createInitialProfile = async (uid: string, email: string | null, displayName: string | null) => {
    console.log('Creating initial profile for user:', uid);
    const userRef = doc(db, 'users', uid);
    const now = Timestamp.now();
    const initialProfile: UserProfile = {
      uid,
      email,
      displayName,
      photoURL: null,
      phoneNumber: null,
      createdAt: now,
      updatedAt: now,
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
      },
      addresses: [],
      paymentMethods: [],
      orderHistory: [],
      notifications: [],
    };

    try {
      await setDoc(userRef, initialProfile);
      console.log('Initial profile created successfully');
      return initialProfile;
    } catch (err: unknown) {
      console.error('Error creating initial profile:', err);
      throw err;
    }
  };

  const initializeProfile = async () => {
    if (!user) {
      console.log('No user found, clearing profile');
      setProfile(null);
      setLoading(false);
      return;
    }

    console.log('Initializing profile for user:', user.uid);
    setLoading(true);
    setError(null);

    try {
      await refreshToken();
      console.log('Token refreshed successfully');

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log('No profile found, creating initial profile');
        const newProfile = await createInitialProfile(
          user.uid,
          user.email,
          user.displayName
        );
        setProfile(newProfile);
      } else {
        console.log('Existing profile found');
        setProfile(userDoc.data() as UserProfile);
      }
    } catch (err: unknown) {
      console.error('Error initializing profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize profile'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) {
      throw new Error('No user or profile found');
    }

    try {
      await refreshToken();
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(userRef, updateData);
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
    } catch (err: unknown) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    await initializeProfile();
  };

  useEffect(() => {
    initializeProfile();
  }, [user]);

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add address';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add order';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add notification';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get orders';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get notifications';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
      toast.error(errorMessage);
      return [];
    }
  };

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      const newPaymentMethod = {
        ...paymentMethod,
        id: crypto.randomUUID()
      };
      const updatedPaymentMethods = [...profile.paymentMethods, newPaymentMethod];
      await updateProfile({ paymentMethods: updatedPaymentMethods });
      toast.success('Payment method added successfully');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add payment method';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removePaymentMethod = async (paymentId: string) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      const updatedPaymentMethods = profile.paymentMethods.filter(
        (method) => method.id !== paymentId
      );
      await updateProfile({ paymentMethods: updatedPaymentMethods });
      toast.success('Payment method removed successfully');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove payment method';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentId: string) => {
    if (!profile) {
      toast.error('No profile found');
      return;
    }

    try {
      setLoading(true);
      const updatedPaymentMethods = profile.paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === paymentId
      }));
      await updateProfile({ paymentMethods: updatedPaymentMethods });
      toast.success('Default payment method updated');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update default payment method';
      setError(errorMessage instanceof Error ? errorMessage : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
    getUnreadUserNotifications,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    refreshProfile
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