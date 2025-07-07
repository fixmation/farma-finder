
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en', user_id } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get ElevenLabs API key from site config
    const { data: configData, error: configError } = await supabaseClient
      .from('site_config')
      .select('config_value')
      .eq('config_key', 'elevenlabs_api_key')
      .single();

    if (configError) {
      console.error('Error fetching ElevenLabs config:', configError);
    }

    const elevenLabsKey = configData?.config_value;

    // Process the user's message and generate a response
    let response = await generateHealthResponse(message, language);

    // Log the interaction for audit purposes
    if (user_id) {
      await supabaseClient.rpc('log_audit_event', {
        p_action: 'voice_assistant_query',
        p_resource_type: 'voice_interaction',
        p_new_values: { 
          query: message, 
          response: response.substring(0, 100) + '...',
          language 
        }
      });
    }

    let audioUrl = null;

    // Generate audio response using ElevenLabs if available
    if (elevenLabsKey && elevenLabsKey.trim()) {
      try {
        audioUrl = await generateAudioResponse(response, elevenLabsKey, language);
      } catch (audioError) {
        console.error('Error generating audio:', audioError);
        // Continue without audio if generation fails
      }
    }

    return new Response(
      JSON.stringify({ 
        response, 
        audioUrl,
        hasAudio: !!audioUrl 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in voice assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process voice request',
        response: 'I apologize, but I encountered an error. Please try again.'
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function generateHealthResponse(message: string, language: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // Health and medication knowledge base
  const responses = {
    en: {
      greeting: "Hello! I'm your health assistant. How can I help you today?",
      pharmacy: "I can help you find nearby pharmacies in Puttalam and surrounding areas. Would you like me to search for specific medications or general pharmacy services?",
      medication: "I can provide information about common medications, their uses, dosages, and potential side effects. Please tell me the specific medication you're asking about.",
      sideEffects: "Side effects can vary by medication and individual. For specific side effect information, please consult with a pharmacist or healthcare provider. I can provide general guidance about common medications.",
      dosage: "Dosage information should always be verified with a healthcare professional. I can provide general information, but please follow your doctor's specific instructions.",
      interaction: "Drug interactions can be serious. If you're taking multiple medications, please consult with your pharmacist or doctor to ensure they're safe to take together.",
      emergency: "If this is a medical emergency, please contact emergency services immediately or visit the nearest hospital. I can help with general health information only.",
      default: "I understand you're asking about health-related topics. Could you please be more specific about what medication or health topic you'd like to know about?"
    },
    si: {
      greeting: "සුභ දවසක්! මම ඔබේ සෞඛ්‍ය සහායකයා. අද මට ඔබට කෙසේ උදව් කළ හැකිද?",
      pharmacy: "පුත්තලම සහ අවට ප්‍රදේශවල ඇති ඖෂධාගාර සොයා ගැනීමට මට ඔබට උදව් කළ හැකිය. විශේෂිත ඖෂධ හෝ සාමාන්‍ය ඖෂධාගාර සේවා සඳහා සෙවීමට ඔබ කැමතිද?",
      medication: "සාමාන්‍ය ඖෂධ, ඒවායේ භාවිතය, මාත්‍රාව සහ අහිතකර බලපෑම් පිළිබඳ තොරතුරු ලබා දීමට මට හැකිය. කරුණාකර ඔබ විමසන නිශ්චිත ඖෂධය මට කියන්න.",
      sideEffects: "අහිතකර බලපෑම් ඖෂධය සහ පුද්ගලයා අනුව වෙනස් විය හැක. නිශ්චිත අහිතකර බලපෑම් පිළිබඳ තොරතුරු සඳහා, කරුණාකර ඖෂධවේදියෙකු හෝ සෞඛ්‍ය සේවා සපයන්නෙකු සමඟ සම්බන්ධ වන්න.",
      dosage: "මාත්‍රා තොරතුරු සෑම විටම සෞඛ්‍ය වෘත්තිකයෙකු සමඟ සත්‍යාපනය කළ යුතුය. මට සාමාන්‍ය තොරතුරු ලබා දිය හැකි නමුත් කරුණාකර ඔබේ වෛද්‍යවරයාගේ නිශ්චිත උපදෙස් අනුගමනය කරන්න.",
      interaction: "ඖෂධ අන්තර්ක්‍රියා බරපතල විය හැක. ඔබ ඖෂධ කිහිපයක් ගන්නේ නම්, ඒවා එකට ගැනීම ආරක්ෂිතද යන්න සහතික කර ගැනීමට කරුණාකර ඔබේ ඖෂධවේදියා හෝ වෛද්‍යවරයා සමඟ සාකච්ඡා කරන්න.",
      emergency: "මෙය වෛද්‍ය හදිසි අවස්ථාවක් නම්, කරුණාකර වහාම හදිසි සේවා සම්බන්ධ කර ගන්න හෝ ළඟම ඇති රෝහලට යන්න. මට සාමාන්‍ය සෞඛ්‍ය තොරතුරු පමණක් සම්බන්ධයෙන් උදව් කළ හැකිය.",
      default: "ඔබ සෞඛ්‍ය සම්බන්ධ කරුණු පිළිබඳව අසන බව මට වැටහේ. කරුණාකර ඔබ දැන ගැනීමට කැමති ඖෂධය හෝ සෞඛ්‍ය මාතෘකාව පිළිබඳව වඩාත් නිශ්චිතව කියන්න."
    },
    ta: {
      greeting: "வணக்கம்! நான் உங்கள் சுகாதார உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
      pharmacy: "புத்தளம் மற்றும் சுற்றியுள்ள பகுதிகளில் உள்ள மருந்தகங்களைக் கண்டறிய நான் உங்களுக்கு உதவ முடியும். குறிப்பிட்ட மருந்துகள் அல்லது பொதுவான மருந்தக சேவைகளுக்கு தேட விரும்புகிறீர்களா?",
      medication: "பொதுவான மருந்துகள், அவற்றின் பயன்கள், அளவுகள் மற்றும் சாத்தியமான பக்க விளைவுகள் பற்றிய தகவல்களை வழங்க என்னால் முடியும். தயவுசெய்து நீங்கள் கேட்கும் குறிப்பிட்ட மருந்தை என்னிடம் சொல்லுங்கள்.",
      sideEffects: "பக்க விளைவுகள் மருந்து மற்றும் தனிநபர் அடிப்படையில் மாறுபடும். குறிப்பிட்ட பக்க விளைவு தகவலுக்கு, தயவுசெய்து மருந்தாளுநர் அல்லது சுகாதார வழங்குநரை அணுகவும்.",
      dosage: "அளவு தகவல் எப்போதும் சுகாதார நிபுணருடன் சரிபார்க்கப்பட வேண்டும். என்னால் பொதுவான தகவல்களை வழங்க முடியும், ஆனால் தயவுசெய்து உங்கள் மருத்துவரின் குறிப்பிட்ட அறிவுரைகளைப் பின்பற்றவும்.",
      interaction: "மருந்து தொடர்புகள் தீவிரமானதாக இருக்கலாம். நீங்கள் பல மருந்துகளை எடுத்துக் கொண்டிருந்தால், அவை ஒன்றாக எடுத்துக்கொள்வது பாதுகாப்பானதா என்பதை உறுதிப்படுத்த தயவுசெய்து உங்கள் மருந்தாளுநர் அல்லது மருத்துவரை ஆலோசிக்கவும்.",
      emergency: "இது மருத்துவ அவசரநிலை என்றால், தயவுசெய்து உடனடியாக அவசர சேவைகளை தொடர்பு கொள்ளுங்கள் அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லுங்கள். பொதுவான சுகாதார தகவல்களுடன் மட்டுமே என்னால் உதவ முடியும்.",
      default: "நீங்கள் சுகாதார தொடர்பான விषயங்களைப் பற்றி கேட்கிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன். தயவுசெய்து நீங்கள் தெரிந்து கொள்ள விரும்பும் மருந்து அல்லது சுகாதார தலைப்பைப் பற்றி இன்னும் குறிப்பாக சொல்ல முடியுமா?"
    }
  };

  const langResponses = responses[language] || responses.en;

  // Simple keyword matching for health topics
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('වන්දනා') || lowerMessage.includes('வணக்கம்')) {
    return langResponses.greeting;
  }
  
  if (lowerMessage.includes('pharmacy') || lowerMessage.includes('ඖෂධාගාර') || lowerMessage.includes('மருந்தகம்')) {
    return langResponses.pharmacy;
  }
  
  if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('drug') || 
      lowerMessage.includes('ඖෂධ') || lowerMessage.includes('மருந்து')) {
    return langResponses.medication;
  }
  
  if (lowerMessage.includes('side effect') || lowerMessage.includes('adverse') || 
      lowerMessage.includes('අහිතකර') || lowerMessage.includes('பக்க விளைவு')) {
    return langResponses.sideEffects;
  }
  
  if (lowerMessage.includes('dosage') || lowerMessage.includes('dose') || lowerMessage.includes('how much') ||
      lowerMessage.includes('මාත්‍රා') || lowerMessage.includes('அளவு')) {
    return langResponses.dosage;
  }
  
  if (lowerMessage.includes('interaction') || lowerMessage.includes('together') ||
      lowerMessage.includes('අන්තර්ක්‍රියා') || lowerMessage.includes('தொடர்பு')) {
    return langResponses.interaction;
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') ||
      lowerMessage.includes('හදිසි') || lowerMessage.includes('அவசர')) {
    return langResponses.emergency;
  }

  return langResponses.default;
}

async function generateAudioResponse(text: string, apiKey: string, language: string): Promise<string | null> {
  try {
    // ElevenLabs voice IDs for different languages
    const voiceIds = {
      'en': 'ErXwobaYiN019PkySvjV', // Default English voice
      'si': 'ErXwobaYiN019PkySvjV', // Fallback to English for Sinhala
      'ta': 'ErXwobaYiN019PkySvjV'  // Fallback to English for Tamil
    };

    const voiceId = voiceIds[language] || voiceIds['en'];

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    
    // Convert blob to base64 data URL
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:audio/mpeg;base64,${base64}`;
    
    return dataUrl;
    
  } catch (error) {
    console.error('Error generating audio with ElevenLabs:', error);
    return null;
  }
}
