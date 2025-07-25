import { useState } from "react";
import { Search, MapPin, Camera, Upload, MessageCircle, FileText, User, LogOut, Mic, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedVoiceAssistant } from "@/components/enhanced-voice/EnhancedVoiceAssistant";
import { useNavigate } from "react-router-dom";
import PharmacyMap from "@/components/PharmacyMap";
import { EnhancedPrescriptionUpload } from "@/components/EnhancedPrescriptionUpload";
import DrugInformation from "@/components/DrugInformation";
import VoiceChatbot from "@/components/VoiceChatbot";
import PDFReportGenerator from "@/components/PDFReportGenerator";
import Footer from "@/components/Footer";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MobileSearchDropdown } from "@/components/MobileSearchDropdown";
import LocationSearch from "@/components/LocationSearch";
import MobileFooterPopup from "@/components/MobileFooterPopup";
import WorkflowSummary from "@/components/WorkflowSummary";

interface ExtractedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  confidence: number;
  isStandardDose: boolean;
  warnings: string[];
}

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("map");
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reportData, setReportData] = useState<{
    medications: ExtractedMedication[];
    analysisDate: Date;
  } | null>(null);

  const handleGenerateReport = (medications: ExtractedMedication[]) => {
    setReportData({
      medications,
      analysisDate: new Date()
    });
    setShowReportGenerator(true);
  };

  const handleDrugQuery = (drugName: string) => {
    setSelectedDrug(drugName);
    setActiveTab("drugs");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLocationSelect = (location: any) => {
    setSearchQuery(location.place_name);
    console.log('Selected location:', location);
    // This will trigger the map to update with the selected location
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#7aebcf] pb-16 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 shadow-blue-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00bfff] to-green-500 rounded-xl flex items-center justify-center shadow-blue-sm">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00bfff] to-green-600 bg-clip-text text-transparent">
                  DigiFarmacy
                </h1>
                <p className="text-sm text-slate-600">{t('hero.title')}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  DigiFarmacy
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop Location Search */}
              <div className="hidden md:block max-w-xs md:max-w-md">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search location..."
                  className="w-full"
                />
              </div>

              {/* Mobile Search Dropdown */}
              <MobileSearchDropdown 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Language Selector */}
              <LanguageSelector />

              {user && profile ? (
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Badge variant="outline" className="hidden sm:flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" />
                    {profile.role}
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="hidden sm:flex items-center gap-2 text-sm"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Button 
                      onClick={() => setShowAuthModal(true)} 
                      size="sm" 
                      className="text-sm shadow-blue-sm bg-gradient-to-r from-[#00bfff] to-green-500 hover:from-[#00bfff]/80 hover:to-green-500/80 text-white"
                    >
                      <span className="hidden sm:inline">Sign In / Sign Up</span>
                      <span className="sm:hidden">Sign In</span>
                    </Button>
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold transform rotate-12 shadow-sm">
                        Free
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/how-to-use')}
                    className="flex items-center gap-1 text-sm shadow-blue-sm border-green-200 hover:bg-green-50"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">How To Use</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="animate-fade-in">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AI-Powered Healthcare
            </h2>
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed px-4">
              Intelligent reporting for comprehensive medication management.
            </p>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:scale-105 transition-all duration-300 animate-scale-in shadow-lg">
              <CardHeader className="text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-blue-sm">
                  <MapPin className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <CardTitle className="text-slate-800 text-sm md:text-base">Find Pharmacies</CardTitle>
                <CardDescription className="text-xs md:text-sm hidden md:block">
                  Smart location search with filters and real-time availability
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:scale-105 transition-all duration-300 animate-scale-in shadow-lg" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#00bfff] to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-blue-sm">
                  <Camera className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <CardTitle className="text-slate-800 text-sm md:text-base">Smart Scan</CardTitle>
                <CardDescription className="text-xs md:text-sm hidden md:block">
                  AI-powered prescription scanning with intelligent validation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:scale-105 transition-all duration-300 animate-scale-in shadow-lg" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#ff00ff] to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-blue-sm">
                  <Mic className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <CardTitle className="text-slate-800 text-sm md:text-base">Enhanced Voice AI</CardTitle>
                <CardDescription className="text-xs md:text-sm hidden md:block">
                  Multi-language support with premium voice synthesis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:scale-105 transition-all duration-300 animate-scale-in shadow-lg" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#ffcd5e] to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-blue-sm">
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <CardTitle className="text-slate-800 text-sm md:text-base">Smart Reports</CardTitle>
                <CardDescription className="text-xs md:text-sm hidden md:block">
                  Interactive PDFs with charts and safety warnings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Workflow Summary Section */}
          <WorkflowSummary />

          {/* Report Generator Modal */}
          {showReportGenerator && reportData && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-blue-xl">
                <PDFReportGenerator
                  reportData={reportData}
                  onClose={() => setShowReportGenerator(false)}
                />
              </div>
            </div>
          )}

          {/* Laboratory Home Visits Pricing */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Laboratory Home Visits
              </CardTitle>
              <CardDescription className="text-gray-600">
                Professional medical testing at your convenience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">LKR 2,500</div>
                  <div className="text-sm text-gray-600 mb-3">Basic Package</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Blood glucose test</p>
                    <p>• Blood pressure check</p>
                    <p>• Basic health assessment</p>
                  </div>
                </div>
                <div className="text-center p-4 border-2 border-blue-600 rounded-lg bg-blue-50">
                  <div className="text-3xl font-bold text-blue-600 mb-2">LKR 4,500</div>
                  <div className="text-sm text-gray-600 mb-3">Complete Package</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Full blood count</p>
                    <p>• Liver function tests</p>
                    <p>• Kidney function tests</p>
                    <p>• Lipid profile</p>
                  </div>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">LKR 7,500</div>
                  <div className="text-sm text-gray-600 mb-3">Premium Package</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Complete blood analysis</p>
                    <p>• Cardiac markers</p>
                    <p>• Diabetes screening</p>
                    <p>• Thyroid function</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  The Package prices given above are only an estimation and guidance, prices may vary with different laboratories.
                </p>
              </div>
              <Button
                onClick={() => navigate('/lab-booking')}
                className="w-full bg-gradient-to-r from-[#00bfff] to-green-500 text-white mt-6"
              >
                Book Home Visit
              </Button>
            </CardContent>
          </Card>

          {/* Main Interface */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="p-4 md:p-6 pb-0">
                  <TabsList className="hidden md:grid w-full grid-cols-5 bg-white border border-gray-200 shadow-sm">
                    <TabsTrigger value="map" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-50">
                      <MapPin className="h-4 w-4 mr-2" />
                      Map
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-green-50">
                      <Camera className="h-4 w-4 mr-2" />
                      Smart Scan
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="data-[state=active]:bg-red-600 data-[state=active]:text-white hover:bg-red-50">
                      <Mic className="h-4 w-4 mr-2" />
                      Voice AI
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-purple-50">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="drugs" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white hover:bg-orange-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Drug Info
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="map" className="mt-0">
                  <div className="shadow-blue-sm">
                    <PharmacyMap searchQuery={searchQuery} />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="mt-0">
                  <div className="p-0 shadow-blue-sm">
                    <EnhancedPrescriptionUpload />
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="mt-0">
                  <div className="p-4 md:p-6 shadow-blue-sm">
                    <EnhancedVoiceAssistant />
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="mt-0">
                  <div className="p-4 md:p-6 shadow-blue-sm">
                    <VoiceChatbot 
                      selectedDrug={selectedDrug}
                      onDrugQuery={handleDrugQuery}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="drugs" className="mt-0">
                  <div className="shadow-blue-sm">
                    <DrugInformation selectedDrug={selectedDrug} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mobile Footer Popup */}
      <MobileFooterPopup />

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;