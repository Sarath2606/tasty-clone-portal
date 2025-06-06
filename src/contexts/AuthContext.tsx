import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  phone: string;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (phone: string, code: string) => Promise<void>;
  signUp: (phone: string, code: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (phone: string, code: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful sign in
      const newUser: User = {
        id: '1',
        name: 'John Doe', // In real app, this would come from the API
        phone,
        memberSince: new Date().toLocaleDateString(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Successfully signed in!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
      throw error;
    }
  };

  const signUp = async (phone: string, code: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful sign up
      const newUser: User = {
        id: '1',
        name: 'John Doe', // In real app, this would come from the API
        phone,
        memberSince: new Date().toLocaleDateString(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Successfully signed up!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to sign up. Please try again.');
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Successfully signed out');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 