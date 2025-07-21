import React, { useState, useMemo } from 'react';
import { Search, Pill, AlertTriangle, Info, Clock, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sriLankanMedicines, medicineCategories, searchMedicines, getMedicineSuggestions, type Medicine } from '@/data/sriLankanMedicines';
import { completeNMRADatabase, searchCompleteNMRADatabase, getNMRADrugSuggestions } from '@/data/completeNMRADatabase';
import PageLayout from '@/components/PageLayout';

const DrugInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Combine all databases for comprehensive search
  const allMedicines = [...sriLankanMedicines, ...completeNMRADatabase];

  const filteredMedicines = useMemo(() => {
    let results = searchTerm ? 
      [...searchMedicines(searchTerm), ...searchCompleteNMRADatabase(searchTerm, 50)] : 
      allMedicines;
    
    if (selectedCategory !== 'all') {
      results = results.filter(med => med.category === selectedCategory);
    }
    
    // Remove duplicates based on name
    const uniqueResults = results.filter((med, index, self) => 
      index === self.findIndex(m => m.name === med.name)
    );
    
    return uniqueResults;
  }, [searchTerm, selectedCategory]);

  // Handle search suggestions from all databases
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 3) {
      const localSuggestions = getMedicineSuggestions(value);
      const nmraSuggestions = getNMRADrugSuggestions(value);
      const allSuggestions = Array.from(new Set([...localSuggestions, ...nmraSuggestions]));
      setSuggestions(allSuggestions.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const categories = [
    { name: 'Pain Relief', count: sriLankanMedicines.filter(m => m.category === 'Pain Relief').length, icon: Heart },
    { name: 'Traditional Medicine', count: sriLankanMedicines.filter(m => m.category === 'Traditional Medicine').length, icon: Pill },
    { name: 'Cardiovascular', count: sriLankanMedicines.filter(m => m.category === 'Cardiovascular').length, icon: Heart },
    { name: 'Diabetes', count: sriLankanMedicines.filter(m => m.category === 'Diabetes').length, icon: AlertTriangle },
    { name: 'Antibiotic', count: sriLankanMedicines.filter(m => m.category === 'Antibiotic').length, icon: Pill },
    { name: 'Gastrointestinal', count: sriLankanMedicines.filter(m => m.category === 'Gastrointestinal').length, icon: Pill }
  ];

  return (
    <PageLayout title="Drug Information Database">
        <div className="min-h-screen bg-gradient-to-br from-white to-[#7aebcf]/20">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7aebcf] to-blue-500 rounded-full mb-4">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Drug Information Database
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search for comprehensive information about medications approved by National Medicines Regulatory Authority (NMRA)
          </p>
            </div>

            {/* Enhanced Search Section */}
            <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Sri Lankan Medicine Search
              </CardTitle>
              <CardDescription>Search for comprehensive information about medications approved by National Medicines Regulatory Authority (NMRA)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <div className="relative">
                    <Input
                      placeholder="Search medicine name (e.g., Panadol, Samahan, Glucophage)"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setSearchTerm(suggestion);
                              setShowSuggestions(false);
                            }}
                          >
                            <span className="text-sm text-gray-700">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {medicineCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quick Search Suggestions */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Popular searches:</span>
                {['Panadol', 'Samahan', 'Amoxil', 'Glucophage'].map((medicine) => (
                  <Button
                    key={medicine}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm(medicine)}
                    className="h-7 px-3 text-xs bg-gradient-to-r from-green-500/10 to-[#00bfff]/10 hover:from-green-500/20 hover:to-[#00bfff]/20 border-green-300"
                  >
                    {medicine}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Categories */}
            <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-[#7aebcf]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="h-5 w-5 text-[#7aebcf]" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-600">{category.count} drugs</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
            </div>

            {/* Drug Results */}
            <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Common Medications'}
          </h2>
          
          {filteredMedicines.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications found</h3>
                <p className="text-gray-600">Try searching with a different term or browse our categories</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredMedicines.map((medicine, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{medicine.name}</CardTitle>
                        <p className="text-sm text-gray-600">{medicine.genericName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{medicine.category}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{medicine.price}</p>
                      </div>
                    </div>
                    <CardDescription>
                      {medicine.dosageForm} • {medicine.strength} • {medicine.manufacturer}
                      {medicine.locallyManufactured && (
                        <span className="ml-2 text-xs border border-gray-300 px-2 py-1 rounded-md">🇱🇰 Local</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="uses" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="uses">Uses</TabsTrigger>
                        <TabsTrigger value="effects">Side Effects</TabsTrigger>
                        <TabsTrigger value="warnings">Warnings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="uses" className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-sm">Medical Uses</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {medicine.uses.map((use, i) => (
                            <Badge key={i} variant="outline">{use}</Badge>
                          ))}
                        </div>
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            <strong>NMRA Registration:</strong> {medicine.nmraRegistration} | 
                            <strong> Availability:</strong> <span className={`ml-1 ${
                              medicine.availability === 'available' ? 'text-green-600' : 
                              medicine.availability === 'limited' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {medicine.availability.replace('_', ' ').toUpperCase()}
                            </span>
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="effects" className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold text-sm">Possible Side Effects</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {medicine.sideEffects.map((effect, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="warnings" className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-sm">Important Warnings</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {medicine.warnings.map((warning, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
            </div>

            {/* Disclaimer */}
            <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h3>
                  <p className="text-sm text-yellow-700">
                    This information is for educational purposes only and should not replace professional medical advice. 
                    Always consult with a healthcare provider before starting, stopping, or changing any medication. 
                    In case of medical emergencies, contact your doctor or emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DrugInfo;