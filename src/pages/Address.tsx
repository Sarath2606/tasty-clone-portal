import { useState } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Address as AddressType } from "@/lib/firestore";
import { MapPicker } from "@/components/ui/map-picker";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

export default function Address() {
  const { profile, updateProfile } = useUserProfile();
  const [address, setAddress] = useState<Omit<AddressType, 'id'>>({
    street: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    isDefault: false
  });
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    // Split the address into components
    const addressComponents = location.address.split(", ");
    const zipCodeMatch = location.address.match(/\b\d{6}\b/); // Match 6-digit PIN code
    
    setAddress(prev => ({
      ...prev,
      street: addressComponents[0] || "",
      city: addressComponents[1] || "",
      state: addressComponents[2] || "",
      country: addressComponents[addressComponents.length - 1] || "India",
      zipCode: zipCodeMatch ? zipCodeMatch[0] : prev.zipCode,
      latitude: location.lat,
      longitude: location.lng
    }));
    
    setShowMap(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedAddresses = [...(profile?.addresses || []), { ...address, id: crypto.randomUUID() }];
      await updateProfile({ addresses: updatedAddresses });
      toast.success("Address added successfully");
      setAddress({
        street: "",
        city: "",
        state: "",
        country: "India",
        zipCode: "",
        isDefault: false
      });
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              Pick Location from Map
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <MapPicker onLocationSelect={handleLocationSelect} />
          </DialogContent>
        </Dialog>

        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            value={address.zipCode}
            onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            required
          />
        </div>
        
        <Button type="submit" className="w-full">
          Add Address
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
        <div className="space-y-4">
          {profile?.addresses?.map((addr) => (
            <div key={addr.id} className="border p-4 rounded-lg">
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
              <p>{addr.country}</p>
              {addr.isDefault && (
                <span className="text-green-500 text-sm">Default Address</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 