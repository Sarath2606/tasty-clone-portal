import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Input } from './input';
import { Button } from './button';
import { MapPin } from 'lucide-react';

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
}

const defaultCenter = {
  lat: 20.5937,  // Default to center of India
  lng: 78.9629
};

export function MapPicker({ onLocationSelect, defaultLocation }: MapPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation || defaultCenter);
  const [address, setAddress] = useState<string>('');

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create search box
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    setSearchBox(searchBox);

    // Create marker
    const marker = new google.maps.Marker({
      map,
      draggable: true,
      position: defaultLocation || defaultCenter,
    });
    setMarker(marker);

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
  }, [defaultLocation]);

  const updateLocationDetails = useCallback(async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
        setSelectedLocation({ lat, lng });
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  }, []);

  useEffect(() => {
    if (!searchBox) return;

    const listener = searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      // Update map and marker
      if (map && marker) {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        marker.setPosition(place.geometry.location);

        // Update location details
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setAddress(place.formatted_address || '');
        setSelectedLocation({ lat, lng });
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [searchBox, map, marker]);

  const handleConfirmLocation = () => {
    onLocationSelect({
      address,
      ...selectedLocation
    });
  };

  return (
    <div className="w-full h-[500px] relative">
      <Input
        id="pac-input"
        type="text"
        placeholder="Search for a location"
        className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 w-[80%] max-w-md"
      />
      <LoadScript
        googleMapsApiKey={process.env.VITE_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={selectedLocation}
          zoom={15}
          onLoad={onLoad}
        />
      </LoadScript>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="w-5 h-5 mt-1 text-primary" />
          <div className="flex-1">
            <p className="font-medium">Selected Location</p>
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </div>
        <Button 
          className="w-full" 
          onClick={handleConfirmLocation}
          disabled={!address}
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
} 