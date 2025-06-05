import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="bg-gray-900 pt-8 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Delicious Food{" "}
              <span className="text-green-500">Delivered to Your</span>{" "}
              Doorstep
            </h1>
            <p className="text-gray-300 text-lg">
              Tired of skipping breakfast in a rush? Place your order in seconds
              and get a hot, healthy tiffin delivered before class or work.
            </p>
            
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input 
                  placeholder="Search for dishes..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <Button className="bg-green-500 hover:bg-green-600 px-8">
                Search
              </Button>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/menu">
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                  Order Now →
                </Button>
              </Link>
              <Link to="/plans">
                <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-3">
                  View Plans →
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                <div className="w-10 h-10 bg-green-600 rounded-full"></div>
                <div className="w-10 h-10 bg-green-700 rounded-full"></div>
              </div>
              <div className="text-white">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">50+ Happy customers</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-200 rounded-3xl p-8 relative overflow-hidden">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-200 rounded-full w-24 h-24 flex items-center justify-center">
                  🍛
                </div>
                <div className="bg-yellow-200 rounded-full w-24 h-24 flex items-center justify-center">
                  🥘
                </div>
                <div className="bg-orange-300 rounded-full w-24 h-24 flex items-center justify-center">
                  🫓
                </div>
                <div className="bg-green-200 rounded-full w-24 h-24 flex items-center justify-center">
                  🥗
                </div>
                <div className="bg-yellow-300 rounded-full w-24 h-24 flex items-center justify-center">
                  🍳
                </div>
                <div className="bg-orange-400 rounded-full w-24 h-24 flex items-center justify-center">
                  ☕
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-3">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
