import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";

export const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-600 flex items-center justify-center text-white text-2xl">
                  {user.fullName?.[0] || "U"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.fullName || "User"}
              </h1>
              <p className="text-gray-400">
                {user.primaryPhoneNumber?.phoneNumber || "No phone number"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Account Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Phone Number</p>
                  <p className="text-white">
                    {user.primaryPhoneNumber?.phoneNumber || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => signOut()}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 