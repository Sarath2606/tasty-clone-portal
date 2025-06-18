import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import { Input } from './input';
import { Button } from './button';
import { MapPin, Crosshair, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './alert';

const libraries: ("places")[] = ["places"];

interface MapPickerProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  defaultLocation?: {
    lat: number;
    lng: number;
  };
  deliveryRadius?: number; // in kilometers
}

const defaultCenter = {
  lat: 17.494869,  // Default to kitchen location
  lng: 78.389576
};

// Restaurant location
const RESTAURANT_LOCATION = {
  lat: 17.494869, // Kitchen's latitude
  lng: 78.389576,  // Kitchen's longitude
};

const DEFAULT_DELIVERY_RADIUS = 5; // 5 km default delivery radius

export function MapPicker({ onLocationSelect, defaultLocation, deliveryRadius = DEFAULT_DELIVERY_RADIUS }: MapPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAOit0cY9yXP4bFWuWcR_-tQILevXlIATk",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation || defaultCenter);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create search box
    const input = document.getElementById("pac-input") as HTMLInputElement;
    if (input) {
      const searchBox = new google.maps.places.SearchBox(input);
      setSearchBox(searchBox);

      // Create marker
      const marker = new google.maps.Marker({
        map,
        draggable: true,
        position: defaultLocation || defaultCenter,
      });
      setMarker(marker);

      // Add delivery radius circle
      new google.maps.Circle({
        map,
        center: RESTAURANT_LOCATION,
        radius: deliveryRadius * 1000,
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      // Bias searchBox results towards current map's viewport
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      // Listen for marker drag events
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          updateLocationDetails(position.lat(), position.lng());
        }
      });

      // Listen for map clicks
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        const position = e.latLng;
        if (position && marker) {
          marker.setPosition(position);
          updateLocationDetails(position.lat(), position.lng());
        }
      });
    }
  }, [defaultLocation, deliveryRadius]);

  const updateLocationDetails = useCallback(async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    try {
      setError(null);
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
        setSelectedLocation({ lat, lng });

        // Check if location is within delivery radius
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(lat, lng),
          new google.maps.LatLng(RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng)
        );
        
        if (distance > deliveryRadius * 1000) {
          setError(`This location is outside our delivery radius of ${deliveryRadius} km`);
        }
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      setError("Failed to get address details. Please try again.");
    }
  }, [deliveryRadius]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        if (map && marker) {
          const location = new google.maps.LatLng(lat, lng);
          map.setCenter(location);
          map.setZoom(17);
          marker.setPosition(location);
          updateLocationDetails(lat, lng);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Could not get your location. Please search or pick a location on the map.");
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!searchBox || !map || !marker) return;

    const listener = searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      // Update map and marker
      map.setCenter(place.geometry.location);
      map.setZoom(17);
      marker.setPosition(place.geometry.location);

      // Update location details
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setAddress(place.formatted_address || '');
      setSelectedLocation({ lat, lng });

      // Check delivery radius
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        place.geometry.location,
        new google.maps.LatLng(RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng)
      );
      
      if (distance > deliveryRadius * 1000) {
        setError(`This location is outside our delivery radius of ${deliveryRadius} km`);
      } else {
        setError(null);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [searchBox, map, marker, deliveryRadius]);

  const handleConfirmLocation = () => {
    onLocationSelect({
      address,
      ...selectedLocation
    });
  };

  if (loadError) {
    return <div className="p-4">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading maps...</div>;
  }

  return (
    <div className="w-full h-[500px] relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-xl flex gap-2">
        <div className="w-4/5">
          <input
            id="pac-input"
            type="text"
            placeholder="Search for your location"
            className="w-full px-4 py-2.5 rounded-lg shadow-md border-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="w-1/5">
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isLoading}
            title="Use current location"
            className="w-full h-full bg-white shadow-md hover:bg-gray-100"
          >
            <Crosshair className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={selectedLocation}
        zoom={15}
        onLoad={onLoad}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          }
        }}
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md space-y-3">
        {error && (
          <Alert variant="destructive" className="bg-white/95 backdrop-blur">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white p-4 rounded-lg shadow-lg backdrop-blur">
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-5 h-5 mt-1 text-primary" />
            <div className="flex-1">
              <p className="font-medium">Selected Location</p>
              <p className="text-sm text-gray-600 break-words">{address}</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleConfirmLocation}
            disabled={!address || !!error}
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
} 