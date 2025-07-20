import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Globe, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' }
  ];

  const sampleQuestions = [
    "What are the side effects of Paracetamol?",
    "Find pharmacies near me",
    "How to take Amoxicillin?",
    "Drug interactions with Aspirin",
    "Emergency pharmacy contact"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#7aebcf]/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#7aebcf] to-blue-500 rounded-full mb-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voice Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant answers about medications, drug interactions, and pharmacy information using voice commands
          </p>
        </div>

        {/* Language Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Select Language
              </CardTitle>
              <CardDescription>Choose your preferred language for voice interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? "default" : "outline"}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Interface */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-[#7aebcf] to-blue-500 hover:scale-105'
              }`}>
                {isListening ? (
                  <MicOff className="h-12 w-12 text-white" />
                ) : (
                  <Mic className="h-12 w-12 text-white" />
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">
                {isListening ? 'Listening...' : 'Tap to speak'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {isListening 
                  ? 'I am listening to your question about medications or pharmacies'
                  : 'Ask me anything about drugs, interactions, or pharmacy locations'
                }
              </p>

              <Button
                onClick={() => setIsListening(!isListening)}
                size="lg"
                className={isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-[#7aebcf] to-blue-500 hover:from-[#6dd8bc] hover:to-blue-600'}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Voice Assistant
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sample Questions */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Try These Questions</CardTitle>
              <CardDescription>Click on any question to try it with the voice assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {sampleQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#7aebcf] hover:bg-[#7aebcf]/5 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium">{question}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Volume2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Multi-language Support</h4>
                  <p className="text-sm text-gray-600">Available in English, Sinhala, and Tamil</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Drug Information</h4>
                  <p className="text-sm text-gray-600">Instant answers about medications and interactions</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Location Services</h4>
                  <p className="text-sm text-gray-600">Find nearby pharmacies and laboratories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;