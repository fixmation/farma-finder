
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import LocationSearch from './LocationSearch';

interface MobileSearchDropdownProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MobileSearchDropdown: React.FC<MobileSearchDropdownProps> = ({
  searchQuery,
  onSearchChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationSelect = (location: any) => {
    onSearchChange(location.place_name);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Search Location</SheetTitle>
            <SheetDescription>
              Find pharmacies near you by searching for a city or area in Sri Lanka.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Search for city, town, or area..."
              className="w-full"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
