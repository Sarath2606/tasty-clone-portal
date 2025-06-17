import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentMethod } from '@/lib/firestore';

const Payments = () => {
  const { user } = useAuth();
  const { profile, loading, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useUserProfile();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  const handleAddPaymentMethod = async () => {
    try {
      let paymentData: Partial<PaymentMethod> = {
        type: paymentType,
        isDefault: profile?.paymentMethods?.length === 0
      };

      if (paymentType === 'card') {
        if (!cardNumber || !expiryDate || !cvv) {
          toast.error('Please fill in all card details');
          return;
        }
        paymentData = {
          ...paymentData,
          cardNumber: cardNumber.slice(-4),
          expiryDate
        };
      } else if (paymentType === 'upi') {
        if (!upiId) {
          toast.error('Please enter UPI ID');
          return;
        }
        paymentData = {
          ...paymentData,
          upiId
        };
      } else if (paymentType === 'netbanking') {
        if (!bankName) {
          toast.error('Please enter bank name');
          return;
        }
        paymentData = {
          ...paymentData,
          bankName
        };
      }

      await addPaymentMethod(paymentData);
      setShowAddDialog(false);
      resetForm();
      toast.success('Payment method added successfully');
    } catch (error) {
      toast.error('Failed to add payment method');
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    try {
      await removePaymentMethod(id);
      toast.success('Payment method removed successfully');
    } catch (error) {
      toast.error('Failed to remove payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to update default payment method');
    }
  };

  const resetForm = () => {
    setPaymentType('card');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setUpiId('');
    setBankName('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button onClick={() => setShowAddDialog(true)}>Add Payment Method</Button>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {profile?.paymentMethods?.map((method) => (
          <div key={method.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                {method.type === 'card' && (
                  <div>
                    <p className="font-medium">Card ending in {method.cardNumber}</p>
                    <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                  </div>
                )}
                {method.type === 'upi' && (
                  <div>
                    <p className="font-medium">UPI ID</p>
                    <p className="text-sm text-gray-500">{method.upiId}</p>
                  </div>
                )}
                {method.type === 'netbanking' && (
                  <div>
                    <p className="font-medium">Net Banking</p>
                    <p className="text-sm text-gray-500">{method.bankName}</p>
                  </div>
                )}
                {method.isDefault && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemovePaymentMethod(method.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
        {(!profile?.paymentMethods || profile.paymentMethods.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No payment methods added yet
          </div>
        )}
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Add Payment Method</DialogTitle>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select value={paymentType} onValueChange={(value: 'card' | 'upi' | 'netbanking') => setPaymentType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentType === 'card' && (
              <>
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={16}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                    />
                  </div>
                </div>
              </>
            )}

            {paymentType === 'upi' && (
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input
                  type="text"
                  placeholder="username@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {paymentType === 'netbanking' && (
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  type="text"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments; 