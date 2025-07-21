import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface LocationSearchProps {
  onLocationSelect: (location: any) => void;
  placeholder?: string;
  className?: string;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  properties: {
    short_code?: string;
  };
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  placeholder = "Search location...", 
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Sri Lankan cities and towns for fallback
  const sriLankanCities = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Polonnaruwa',
    'Trincomalee', 'Batticaloa', 'Ratnapura', 'Badulla', 'Matara', 'Hambantota',
    'Kurunegala', 'Puttalam', 'Kalutara', 'Gampaha', 'Kegalle', 'Monaragala',
    'Ampara', 'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi', 'Nuwara Eliya'
  ];

  const searchMapbox = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!mapboxToken) {
        // Fallback to Sri Lankan cities filter
        const filtered = sriLankanCities
          .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 5)
          .map((city, index) => ({
            id: `fallback-${index}`,
            place_name: `${city}, Sri Lanka`,
            center: [80.7718, 7.8731] as [number, number], // Default to Colombo coordinates
            place_type: ['place'],
            properties: { short_code: 'lk' }
          }));
        setSuggestions(filtered);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${mapboxToken}&` +
        `country=lk&` +
        `types=place,locality,neighborhood,address&` +
        `limit=5`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.features || []);
      } else {
        console.warn('Mapbox API failed, using fallback');
        // Use fallback cities
        const filtered = sriLankanCities
          .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 5)
          .map((city, index) => ({
            id: `fallback-${index}`,
            place_name: `${city}, Sri Lanka`,
            center: [80.7718, 7.8731] as [number, number],
            place_type: ['place'],
            properties: { short_code: 'lk' }
          }));
        setSuggestions(filtered);
      }
    } catch (error) {
      console.error('Location search error:', error);
      // Use fallback for Sri Lankan cities
      const filtered = sriLankanCities
        .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
        .map((city, index) => ({
          id: `fallback-${index}`,
          place_name: `${city}, Sri Lanka`,
          center: [80.7718, 7.8731] as [number, number],
          place_type: ['place'],
          properties: { short_code: 'lk' }
        }));
      setSuggestions(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length >= 3) {
      timeoutRef.current = setTimeout(() => {
        searchMapbox(query);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
          if (!mapboxToken) {
            setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            onLocationSelect({
              place_name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              center: [longitude, latitude]
            });
            setIsGettingLocation(false);
            return;
          }

          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
            `access_token=${mapboxToken}&` +
            `types=place,locality,neighborhood,address`
          );

          if (response.ok) {
            const data = await response.json();
            const feature = data.features[0];
            if (feature) {
              setQuery(feature.place_name);
              onLocationSelect(feature);
              toast({
                title: "Location found",
                description: `Current location: ${feature.place_name}`
              });
            }
          } else {
            setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            onLocationSelect({
              place_name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              center: [longitude, latitude]
            });
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          onLocationSelect({
            place_name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            center: [longitude, latitude]
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let message = "Unable to get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access denied. Please allow location access and try again.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out.";
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    setQuery(suggestion.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
    onLocationSelect(suggestion);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="pl-10 pr-4 h-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="ml-2 h-10 px-3 bg-gradient-to-r from-[#00bfff] to-green-500 hover:from-[#00bfff]/80 hover:to-green-500/80 text-white border-0"
          title="Get current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">{suggestion.place_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;