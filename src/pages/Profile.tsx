import { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  CreditCard, 
  MapPin, 
  Bell, 
  HelpCircle, 
  LogOut,
  History,
  CreditCard as SubscriptionIcon,
  Edit2,
  Plus
} from 'lucide-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { auth } from '@/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/firestore';
import { AuthModal } from '@/components/AuthModal';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const Profile = () => {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  // For mobile accordion state
  const [mobileActiveSection, setMobileActiveSection] = useState('personal');
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Ensure personal info is open by default on mobile
  useEffect(() => {
    setMobileActiveSection('personal');
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const displayName = formData.get('displayName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    // Validate inputs
    if (!displayName || displayName.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }

    const updates = {
      displayName: displayName.trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : null,
    };
    
    try {
      await updateProfile(updates);
      setShowEditProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePreferencesUpdate = async (preferences: Partial<UserProfile['preferences']>) => {
    if (!profile) return;
    
    try {
      const updatedPreferences = {
        ...profile.preferences,
        ...preferences
      };
      await updateProfile({ preferences: updatedPreferences });
    } catch (error) {
      // Error is already handled by the context
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!profile) {
    // Show a static profile page with options similar to the provided image, but without Food Orders, and make Continue button trigger auth
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Your profile</h2>
          <p className="mb-4 text-gray-500">Log in or sign up to view your complete profile</p>
          <AuthModal>
            <button
              className="w-full border border-red-400 text-red-500 rounded-lg py-3 mb-6 font-semibold text-lg hover:bg-red-50"
            >
              Continue
            </button>
          </AuthModal>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center border rounded-lg py-4">
              <span className="mb-2">🔖</span>
              <span>Collections</span>
            </div>
            <div className="flex flex-col items-center justify-center border rounded-lg py-4">
              <span className="mb-2">💰</span>
              <span>Money</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">More</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-left px-2 py-2 rounded hover:bg-gray-50">
                <span>ℹ️</span>
                <span>About</span>
              </button>
              <button className="flex items-center gap-2 text-left px-2 py-2 rounded hover:bg-gray-50">
                <span>✏️</span>
                <span>Send feedback</span>
              </button>
              <button className="flex items-center gap-2 text-left px-2 py-2 rounded hover:bg-gray-50">
                <span>🚨</span>
                <span>Report a safety emergency</span>
              </button>
              <button className="flex items-center gap-2 text-left px-2 py-2 rounded hover:bg-gray-50">
                <span>⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use your app's section names and icons
  const sectionLinks = [
    { id: 'orders', icon: Package, label: 'My Orders', to: '/profile/orders' },
    { id: 'subscriptions', icon: SubscriptionIcon, label: 'Subscriptions', to: '/profile/subscriptions' },
    { id: 'address', icon: MapPin, label: 'Address', to: '/profile/address' },
    { id: 'payments', icon: CreditCard, label: 'Payments', to: '/profile/payments' },
    { id: 'history', icon: History, label: 'Order History', to: '/profile/history' },
    { id: 'notifications', icon: Bell, label: 'Notifications', to: '/profile/notifications' },
    { id: 'support', icon: HelpCircle, label: 'Support', to: '/profile/support' },
    { id: 'test', icon: HelpCircle, label: 'Firestore Test', to: '/profile/test' },
  ];

  return (
    <div className="max-w-xl mx-auto px-2 py-6">
      {/* Profile header */}
      <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
          {profile?.displayName && profile.displayName.length > 0 ? profile.displayName[0].toUpperCase() : 'U'}
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold text-gray-900">{profile?.displayName || 'User'}</div>
          <button
            className="mt-1 text-sm text-white bg-green-500 px-4 py-1 rounded font-medium hover:bg-green-600"
            onClick={() => setShowEditProfile(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Edit Personal Information</DialogTitle>
          <form onSubmit={handleProfileUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={profile.displayName || ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={profile.phoneNumber || ''}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditProfile(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main section list */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="flex flex-col divide-y">
          {sectionLinks.map(link => (
            <Link
              key={link.id}
              to={link.to}
              className="flex items-center gap-3 py-3 hover:bg-gray-50 transition rounded-lg px-2"
            >
              <link.icon className="w-6 h-6 text-gray-400" />
              <span className="flex-1 text-base text-gray-900">{link.label}</span>
              <span className="text-gray-300">&gt;</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Log out button at the bottom */}
      <div className="max-w-xl mx-auto px-2 pb-8">
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow mt-4"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile; 