import React, { useState } from 'react';
import { Search, Pill, AlertTriangle, Info, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DrugInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const commonDrugs = [
    {
      name: 'Paracetamol',
      category: 'Pain Relief',
      dosage: '500mg - 1000mg',
      frequency: 'Every 4-6 hours',
      uses: ['Fever', 'Headache', 'Body aches'],
      sideEffects: ['Rare allergic reactions', 'Liver damage with overdose'],
      warnings: ['Do not exceed 4g daily', 'Avoid with alcohol']
    },
    {
      name: 'Amoxicillin',
      category: 'Antibiotic',
      dosage: '250mg - 500mg',
      frequency: 'Every 8 hours',
      uses: ['Bacterial infections', 'Respiratory infections', 'UTI'],
      sideEffects: ['Nausea', 'Diarrhea', 'Skin rash'],
      warnings: ['Complete full course', 'Take with food', 'Report allergic reactions']
    },
    {
      name: 'Aspirin',
      category: 'NSAID',
      dosage: '75mg - 300mg',
      frequency: 'Once daily',
      uses: ['Heart protection', 'Blood thinning', 'Pain relief'],
      sideEffects: ['Stomach irritation', 'Bleeding risk'],
      warnings: ['Not for children under 16', 'Take with food', 'Monitor for bleeding']
    }
  ];

  const categories = [
    { name: 'Pain Relief', count: 45, icon: Heart },
    { name: 'Antibiotics', count: 32, icon: Pill },
    { name: 'Heart Medicine', count: 28, icon: Heart },
    { name: 'Diabetes', count: 24, icon: AlertTriangle },
    { name: 'Blood Pressure', count: 19, icon: Heart },
    { name: 'Respiratory', count: 15, icon: Pill }
  ];

  const filteredDrugs = searchTerm
    ? commonDrugs.filter(drug =>
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commonDrugs;

  return (
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
            Comprehensive medication information including dosage, side effects, and safety warnings
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for medications (e.g., Paracetamol, Amoxicillin)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
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
          
          {filteredDrugs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications found</h3>
                <p className="text-gray-600">Try searching with a different term or browse our categories</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredDrugs.map((drug, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{drug.name}</CardTitle>
                      <Badge variant="secondary">{drug.category}</Badge>
                    </div>
                    <CardDescription>
                      {drug.dosage} • {drug.frequency}
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
                          {drug.uses.map((use, i) => (
                            <Badge key={i} variant="outline">{use}</Badge>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="effects" className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold text-sm">Possible Side Effects</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {drug.sideEffects.map((effect, i) => (
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
                          {drug.warnings.map((warning, i) => (
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
  );
};

export default DrugInfo;