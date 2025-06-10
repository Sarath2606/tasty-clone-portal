import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useUserProfile } from './UserProfileContext';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';

interface MessageLimitContextType {
  messagesLeft: number;
  lastMessageTime: Date | null;
  canSendMessage: boolean;
  checkMessageLimit: () => Promise<boolean>;
  updateMessageCount: () => Promise<void>;
}

const MessageLimitContext = createContext<MessageLimitContextType | undefined>(undefined);

export const MessageLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messagesLeft, setMessagesLeft] = useState(2);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const checkMessageLimit = async (): Promise<boolean> => {
    if (!user) return false;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    const messageData = userData.messageData || {
      count: 0,
      lastReset: Timestamp.now(),
      lastMessageTime: null
    };

    // Check if we need to reset the count (after midnight)
    const now = new Date();
    const lastReset = messageData.lastReset.toDate();
    const isNewDay = now.getDate() !== lastReset.getDate() || 
                     now.getMonth() !== lastReset.getMonth() || 
                     now.getFullYear() !== lastReset.getFullYear();

    if (isNewDay) {
      // Reset the count
      await updateDoc(userRef, {
        messageData: {
          count: 0,
          lastReset: Timestamp.now(),
          lastMessageTime: null
        }
      });
      setMessagesLeft(2);
      setLastMessageTime(null);
      return true;
    }

    const remaining = 2 - messageData.count;
    setMessagesLeft(remaining);
    setLastMessageTime(messageData.lastMessageTime?.toDate() || null);
    return remaining > 0;
  };

  const updateMessageCount = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const messageData = userData.messageData || {
      count: 0,
      lastReset: Timestamp.now(),
      lastMessageTime: null
    };

    await updateDoc(userRef, {
      messageData: {
        count: messageData.count + 1,
        lastReset: messageData.lastReset,
        lastMessageTime: Timestamp.now()
      }
    });

    setMessagesLeft(prev => prev - 1);
    setLastMessageTime(new Date());
  };

  useEffect(() => {
    if (user) {
      checkMessageLimit();
    }
  }, [user]);

  const value = {
    messagesLeft,
    lastMessageTime,
    canSendMessage: messagesLeft > 0,
    checkMessageLimit,
    updateMessageCount
  };

  return (
    <MessageLimitContext.Provider value={value}>
      {children}
    </MessageLimitContext.Provider>
  );
};

export const useMessageLimit = () => {
  const context = useContext(MessageLimitContext);
  if (context === undefined) {
    throw new Error('useMessageLimit must be used within a MessageLimitProvider');
  }
  return context;
}; 