import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Navigate } from 'react-router-dom';
import { Notification } from '@/lib/firestore';
import { format } from 'date-fns';
import { Bell, Check, Trash2, Settings, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const notificationTypeColors = {
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();

  useEffect(() => {
    if (!user || !profile) return;

    setLoading(true);
    setError(null);

    // Get notifications from profile
    const userNotifications = profile.notifications || [];
    setNotifications(userNotifications);
    setLoading(false);
  }, [user, profile]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!profile) return;

    try {
      const updatedNotifications = profile.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );

      await updateProfile({ notifications: updatedNotifications });
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!profile) return;

    try {
      const updatedNotifications = profile.notifications.filter(
        notification => notification.id !== notificationId
      );

      await updateProfile({ notifications: updatedNotifications });
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!profile) return;

    try {
      const updatedNotifications = profile.notifications.map(notification => ({
        ...notification,
        read: true
      }));

      await updateProfile({ notifications: updatedNotifications });
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const handleUpdatePreferences = async (preferences: Partial<typeof profile.preferences>) => {
    if (!profile) return;

    try {
      await updateProfile({
        preferences: {
          ...profile.preferences,
          ...preferences
        }
      });
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredNotifications = notifications
    .filter(notification => {
      // Filter by tab
      if (activeTab === 'unread' && notification.read) return false;
      if (activeTab === 'read' && !notification.read) return false;

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={profile?.preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  handleUpdatePreferences({ emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={profile?.preferences.pushNotifications}
                onCheckedChange={(checked) =>
                  handleUpdatePreferences({ pushNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch
                id="sms-notifications"
                checked={profile?.preferences.smsNotifications}
                onCheckedChange={(checked) =>
                  handleUpdatePreferences({ smsNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          {activeTab === 'unread' && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <TabsContent value="all">
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="unread">
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="read">
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const NotificationList = ({ notifications, onMarkAsRead, onDelete, loading }: NotificationListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Bell className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500 text-lg">No notifications found</p>
          <p className="text-gray-400 text-sm">
            Your notifications will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <Badge className={notificationTypeColors[notification.type]}>
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(notification.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600">{notification.message}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {format(notification.createdAt.toDate(), 'MMM d, yyyy h:mm a')}
                </span>
                {!notification.read && (
                  <Badge variant="outline" className="ml-2">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 