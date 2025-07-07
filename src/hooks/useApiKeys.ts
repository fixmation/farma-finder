
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKeyConfig {
  name: string;
  description: string;
  required: boolean;
  features: string[];
}

export const API_KEY_CONFIGS: Record<string, ApiKeyConfig> = {
  GEMINI_API_KEY: {
    name: 'Google Gemini API',
    description: 'For prescription analysis and drug information extraction',
    required: true,
    features: ['Smart Scan', 'Drug Information', 'Prescription Upload']
  },
  MAPBOX_ACCESS_TOKEN: {
    name: 'Mapbox Access Token',
    description: 'For pharmacy location mapping and search functionality',
    required: true,
    features: ['Pharmacy Map', 'Location Search', 'Nearby Pharmacies']
  },
  ELEVENLABS_API_KEY: {
    name: 'ElevenLabs API',
    description: 'For premium voice synthesis in multiple languages',
    required: false,
    features: ['Enhanced Voice AI', 'Text-to-Speech']
  },
  OPENAI_API_KEY: {
    name: 'OpenAI API',
    description: 'For AI chatbot and voice assistance features',
    required: false,
    features: ['Voice Chat', 'AI Assistant', 'Drug Queries']
  }
};

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiKeys();
  }, []);

  const checkApiKeys = async () => {
    try {
      // In a real implementation, you would check these from your backend
      // For now, we'll simulate the check
      const keys: Record<string, string> = {};
      
      // Check if keys exist in site config (this would be done server-side)
      const { data: configs } = await supabase
        .from('site_config')
        .select('config_key, config_value')
        .in('config_key', Object.keys(API_KEY_CONFIGS));

      configs?.forEach(config => {
        if (config.config_value) {
          keys[config.config_key] = config.config_value;
        }
      });

      setApiKeys(keys);
    } catch (error) {
      console.error('Error checking API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const isKeyConfigured = (keyName: string): boolean => {
    return Boolean(apiKeys[keyName]);
  };

  const getRequiredKeys = (): ApiKeyConfig[] => {
    return Object.entries(API_KEY_CONFIGS)
      .filter(([_, config]) => config.required)
      .map(([_, config]) => config);
  };

  const getMissingRequiredKeys = (): string[] => {
    return Object.entries(API_KEY_CONFIGS)
      .filter(([key, config]) => config.required && !isKeyConfigured(key))
      .map(([key, _]) => key);
  };

  return {
    apiKeys,
    loading,
    isKeyConfigured,
    getRequiredKeys,
    getMissingRequiredKeys,
    checkApiKeys
  };
};
