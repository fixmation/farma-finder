import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceChatbotProps {
  selectedDrug?: string | null;
  onDrugQuery: (drugName: string) => void;
}

const VoiceChatbot = ({ selectedDrug, onDrugQuery }: VoiceChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your DigiFarmacy AI assistant. I can help you with finding pharmacies, understanding medications, prescription analysis, and navigating our platform. How can I assist you today?',
      timestamp: new Date()
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Enhanced AI assistant with FarmaFinder knowledge
  const processAIQuery = (text: string) => {
    const query = text.toLowerCase();

    // FarmaFinder specific responses
    if (query.includes('farmafinder') || query.includes('about this app')) {
      return 'FarmaFinder is an AI-enhanced health companion for Sri Lanka. We help you find verified pharmacies, analyze prescriptions using AI, get drug information, and manage your medications. Our platform connects patients with registered pharmacies across the country.';
    }

    if (query.includes('find pharmacy') || query.includes('pharmacy near')) {
      return 'You can find nearby pharmacies using our interactive map. Click on the "Map" tab to see verified pharmacies in your area. We show only registered and verified pharmacies with their contact details, operating hours, and directions.';
    }

    if (query.includes('prescription') || query.includes('scan')) {
      return 'Our Smart Scan feature uses AI to analyze prescription images. Upload a photo of your prescription, and our system will extract medication details, provide drug information, and help you find pharmacies that stock your medicines.';
    }

    if (query.includes('voice') || query.includes('speak')) {
      return 'Use our Voice AI feature to interact hands-free! You can ask about medications, find pharmacies, or get health information using voice commands in English, Sinhala, or Tamil.';
    }

    if (query.includes('language') || query.includes('sinhala') || query.includes('tamil')) {
      return 'FarmaFinder supports multiple languages: English, සිංහල (Sinhala), and தமிழ் (Tamil). You can switch languages in the voice assistant or ask me questions in your preferred language.';
    }

    if (query.includes('pharmacy registration') || query.includes('register pharmacy')) {
      return 'Pharmacies can register by signing up with their business details, uploading pharmacist certificates, and business registration documents. After verification by our admin team, they can list products and receive customers.';
    }

    if (query.includes('drug') || query.includes('medication') || query.includes('medicine')) {
      const drugPatterns = /(?:about|tell me about|what is|info on)\s+([a-zA-Z]+)/i;
      const match = text.match(drugPatterns);
      if (match && match[1]) {
        onDrugQuery(match[1]);
        return `I've searched for information about ${match[1]}. Check the Drug Information section for detailed data including side effects, dosage, and interactions.`;
      }
      return 'I can provide detailed drug information including side effects, dosage, interactions, and safety warnings. Just tell me the name of the medication you\'re interested in.';
    }

    if (query.includes('pdpa') || query.includes('privacy') || query.includes('data')) {
      return 'FarmaFinder is fully compliant with Sri Lanka\'s Personal Data Protection Act (PDPA). We protect your health data with encryption, secure storage, and strict access controls. Check our PDPA compliance page for details.';
    }

    if (query.includes('commission') || query.includes('payment') || query.includes('payout')) {
      return 'Registered pharmacies earn commissions on each prescription fulfilled. They can track earnings in real-time and request payouts through LankaQR or bank transfers from their dashboard.';
    }

    if (query.includes('help') || query.includes('how to')) {
      return 'I can help with: 1) Finding pharmacies near you, 2) Understanding your prescriptions, 3) Getting drug information, 4) Using voice features, 5) Pharmacy registration, 6) Account management. What would you like to know more about?';
    }

    // General health and pharmacy guidance
    if (query.includes('side effect') || query.includes('interaction')) {
      return 'For detailed side effects and drug interactions, use our Drug Information feature. Always consult with a pharmacist or doctor for personalized medical advice. Our platform provides general information only.';
    }

    // Default helpful response
    return `I understand you're asking about "${text}". As your FarmaFinder assistant, I can help you with finding pharmacies, understanding medications, prescription analysis, and platform features. Could you be more specific about what you'd like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Process with enhanced AI
    setTimeout(() => {
      const response = processAIQuery(inputText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      scrollToBottom();
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-medical-blue" />
              FarmaFinder AI Assistant
            </div>
            <Badge className="bg-medical-green/10 text-medical-green">
              Smart Chat
            </Badge>
          </CardTitle>
          <CardDescription>
            Ask about pharmacies, medications, prescriptions, or how to use FarmaFinder
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-medical-blue text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about FarmaFinder..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="medical-gradient text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChatbot;