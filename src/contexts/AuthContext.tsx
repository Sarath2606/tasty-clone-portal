import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshToken: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    if (user) {
      try {
        await user.getIdToken(true);
        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        console.log("Auth state changed:", user ? "User is signed in" : "No user");
        if (user) {
          try {
            // Force token refresh on auth state change
            await user.getIdToken(true);
            console.log("User details:", {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified
            });
          } catch (error) {
            console.error("Error refreshing token:", error);
          }
        }
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        toast.error("Authentication error occurred");
        setLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 