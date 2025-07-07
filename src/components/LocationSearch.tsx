
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LocationSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationSuggestion) => void;
  placeholder?: string;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  placeholder = "Search location...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkMapboxToken();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkMapboxToken = async () => {
    try {
      const response = await fetch('/api/config/mapbox-token');
      if (response.ok) {
        const data = await response.json();
        setMapboxToken(data.token || '');
      }
    } catch (error) {
      console.error('Error fetching Mapbox token:', error);
    }
  };

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    if (!mapboxToken) {
      // Show mock suggestions for Sri Lankan locations with proper typing
      const mockSuggestions: LocationSuggestion[] = [
        {
          id: '1',
          place_name: 'Puttalam, North Western Province, Sri Lanka',
          center: [79.8347, 8.0362] as [number, number],
          place_type: ['place']
        },
        {
          id: '2', 
          place_name: 'Colombo, Western Province, Sri Lanka',
          center: [79.8612, 6.9271] as [number, number],
          place_type: ['place']
        },
        {
          id: '3',
          place_name: 'Kandy, Central Province, Sri Lanka', 
          center: [80.6337, 7.2906] as [number, number],
          place_type: ['place']
        },
        {
          id: '4',
          place_name: 'Galle, Southern Province, Sri Lanka',
          center: [80.2170, 6.0535] as [number, number],
          place_type: ['place']
        }
      ].filter(location => 
        location.place_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${mapboxToken}&` +
        `country=LK&` + // Restrict to Sri Lanka
        `types=place,locality,neighborhood&` +
        `limit=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      const mappedSuggestions: LocationSuggestion[] = (data.features || []).map((feature: any) => ({
        id: feature.id,
        place_name: feature.place_name,
        center: feature.center as [number, number],
        place_type: feature.place_type
      }));
      
      setSuggestions(mappedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Location search error:', error);
      toast.error('Failed to search locations. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.place_name);
    setShowSuggestions(false);
    onLocationSelect(suggestion);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
          onFocus={() => query && setShowSuggestions(true)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center gap-3"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-medical-blue flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{suggestion.place_name}</span>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query.length > 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 text-center text-gray-500 text-sm">
          No locations found for "{query}"
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
