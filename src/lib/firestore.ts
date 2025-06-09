import { db } from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

// Type definitions
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orderHistory: Order[];
  notifications: Notification[];
  preferences: UserPreferences;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  last4?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Timestamp;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

// Helper functions
export const createUserProfile = async (uid: string, userData: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  const now = Timestamp.now();
  
  const newProfile: UserProfile = {
    uid,
    displayName: userData.displayName || null,
    email: userData.email || null,
    photoURL: userData.photoURL || null,
    phoneNumber: userData.phoneNumber || null,
    createdAt: now,
    updatedAt: now,
    addresses: [],
    paymentMethods: [],
    orderHistory: [],
    notifications: [],
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
    },
    ...userData
  };

  try {
    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return null;
  }
  
  return userDoc.data() as UserProfile;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  
  try {
    // First get the current profile to ensure it exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    // Prepare the update data
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };

    // Remove any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Perform the update
    await updateDoc(userRef, updateData);
    
    // Return the updated profile
    const updatedDoc = await getDoc(userRef);
    return updatedDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const addAddress = async (uid: string, address: Omit<Address, 'id'>) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data() as UserProfile;
  const newAddress = {
    ...address,
    id: crypto.randomUUID()
  };
  
  const updatedAddresses = [...userData.addresses, newAddress];
  await updateDoc(userRef, { addresses: updatedAddresses });
  
  return newAddress;
};

export const addOrder = async (uid: string, order: Omit<Order, 'id'>) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data() as UserProfile;
  const newOrder = {
    ...order,
    id: crypto.randomUUID(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  const updatedOrders = [...userData.orderHistory, newOrder];
  await updateDoc(userRef, { orderHistory: updatedOrders });
  
  return newOrder;
};

export const addNotification = async (uid: string, notification: Omit<Notification, 'id' | 'createdAt'>) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data() as UserProfile;
  const newNotification = {
    ...notification,
    id: crypto.randomUUID(),
    createdAt: Timestamp.now()
  };
  
  const updatedNotifications = [...userData.notifications, newNotification];
  await updateDoc(userRef, { notifications: updatedNotifications });
  
  return newNotification;
};

// Query helpers
export const getRecentOrders = async (uid: string, limit: number = 5) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return [];
  }
  
  const userData = userDoc.data() as UserProfile;
  return userData.orderHistory
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, limit);
};

export const getUnreadNotifications = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return [];
  }
  
  const userData = userDoc.data() as UserProfile;
  return userData.notifications.filter(n => !n.read);
}; 