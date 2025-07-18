
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Play, Pause, Settings, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

// Add proper TypeScript declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

type Language = 'en' | 'si' | 'ta';
type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface VoiceSettings {
  language: Language;
  voiceType: VoiceType;
  speed: number;
  pitch: number;
}

const LANGUAGE_NAMES = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்'
};

const VOICE_NAMES = {
  alloy: 'Alloy (Neutral)',
  echo: 'Echo (Male)',
  fable: 'Fable (British)',
  onyx: 'Onyx (Deep)',
  nova: 'Nova (Female)',
  shimmer: 'Shimmer (Soft)'
};

export const EnhancedVoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en',
    voiceType: 'alloy',
    speed: 1.0,
    pitch: 1.0
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startListening = async () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast.error('Speech recognition not supported in this browser');
        return;
      }

      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = settings.language === 'en' ? 'en-US' : 
                                   settings.language === 'si' ? 'si-LK' : 'ta-LK';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          processVoiceInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        toast.error(`Speech recognition error: ${event.error}`);
      };

      recognitionRef.current.start();
    } catch (error) {
      toast.error('Failed to start voice recognition');
      console.error('Voice recognition error:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = `Based on your question about "${input}", here's what I found: This is a simulated response that would normally come from our AI health assistant. The response would be tailored to your specific health query and provided in ${LANGUAGE_NAMES[settings.language]}.`;
      
      setResponse(mockResponse);
      
      // Generate speech from response
      await generateSpeech(mockResponse);
      
    } catch (error) {
      toast.error('Failed to process voice input');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSpeech = async (text: string) => {
    try {
      // This would be replaced with actual API call to generate speech
      toast.success('Audio generated successfully');
      
      // Mock audio URL - replace with actual implementation
      setAudioUrl('mock-audio-url');
      
    } catch (error) {
      toast.error('Failed to generate speech');
      console.error('Speech generation error:', error);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-medical-green" />
              FarmaFinder Voice Assistant
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language Selection - Centered in mobile */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-center">Select Language</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
                <Button
                  key={lang}
                  variant={settings.language === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, language: lang }))}
                  className={settings.language === lang ? "medical-gradient text-white" : ""}
                >
                  {LANGUAGE_NAMES[lang]}
                </Button>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                {/* Voice Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice Type</label>
                  <Select
                    value={settings.voiceType}
                    onValueChange={(value: VoiceType) => 
                      setSettings(prev => ({ ...prev, voiceType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(VOICE_NAMES) as VoiceType[]).map((voice) => (
                        <SelectItem key={voice} value={voice}>
                          {VOICE_NAMES[voice]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Speaking Speed: {settings.speed}x</label>
                  <Slider
                    value={[settings.speed]}
                    onValueChange={([value]) => setSettings(prev => ({ ...prev, speed: value }))}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Interface */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`w-24 h-24 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'medical-gradient'
                } text-white shadow-lg`}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              {isListening && (
                <Badge variant="outline" className="animate-pulse">
                  Listening in {LANGUAGE_NAMES[settings.language]}...
                </Badge>
              )}
              {isProcessing && (
                <Badge variant="outline" className="animate-pulse">
                  Processing your request...
                </Badge>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <Card className="bg-blue-50">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-800 mb-2">You said:</h4>
                <p className="text-blue-700">{transcript}</p>
              </CardContent>
            </Card>
          )}

          {/* Response Display */}
          {response && (
            <Card className="bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">AI Response:</h4>
                  {audioUrl && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={isPlaying ? pauseAudio : playAudio}
                        className="flex items-center gap-1"
                      >
                        {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-green-700">{response}</p>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>Click the microphone to start voice interaction</p>
            <p>Ask about medications, symptoms, or health information</p>
            <p>Responses will be provided in your selected language</p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};
