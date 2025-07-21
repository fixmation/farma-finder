import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.pharmacies': 'Pharmacies',
    'nav.labs': 'Laboratories',
    'nav.drugs': 'Drug Information',
    'nav.workflow': 'How It Works',
    
    // Hero Section
    'hero.title': 'AI-Enhanced Health Companion',
    'hero.subtitle': 'Connect with verified pharmacies and laboratories across Sri Lanka through intelligent technology',
    'hero.cta.primary': 'Find Pharmacy',
    'hero.cta.secondary': 'Upload Prescription',
    
    // Features
    'features.pharmacy.title': 'Find Nearest Pharmacy',
    'features.pharmacy.description': 'Locate verified pharmacies with real-time availability',
    'features.scan.title': 'Smart Prescription Scan',
    'features.scan.description': 'AI-powered prescription analysis and medicine identification',
    'features.voice.title': 'Voice Assistant',
    'features.voice.description': 'Multi-language voice guidance and support',
    'features.drugs.title': 'Drug Information',
    'features.drugs.description': 'Comprehensive NMRA-approved medicine database',
    
    // Workflow
    'workflow.title': 'How DigiFarmacy Works',
    'workflow.step1': 'Find Pharmacy',
    'workflow.step2': 'Upload Prescription',
    'workflow.step3': 'Get Notification',
    'workflow.step4': 'Collect Medicine',
    'workflow.viewFull': 'View Full Workflow',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
  },
  si: {
    // Header
    'nav.home': 'මුල් පිටුව',
    'nav.pharmacies': 'ෆාමසි',
    'nav.labs': 'රසායනාගාර',
    'nav.drugs': 'ඖෂධ තොරතුරු',
    'nav.workflow': 'එය ක්‍රියා කරන ආකාරය',
    
    // Hero Section
    'hero.title': 'AI-වැඩිදියුණු කළ සෞඛ්‍ය සහකරු',
    'hero.subtitle': 'බුද්ධිමත් තාක්ෂණය හරහා ශ්‍රී ලංකාව පුරා සත්‍යාපිත ෆාමසි සහ රසායනාගාර සමඟ සම්බන්ධ වන්න',
    'hero.cta.primary': 'ෆාමසි සොයන්න',
    'hero.cta.secondary': 'බෙහෙත් වට්ටෝරුව උඩුගත කරන්න',
    
    // Features
    'features.pharmacy.title': 'ළඟම ෆාමසිය සොයන්න',
    'features.pharmacy.description': 'තත්‍ය කාලීන ලබා ගත හැකි බව සමඟ සත්‍යාපිත ෆාමසි සොයා ගන්න',
    'features.scan.title': 'ස්මාර්ට් බෙහෙත් වට්ටෝරු ස්කෑන්',
    'features.scan.description': 'AI-බලගන්වන බෙහෙත් වට්ටෝරු විශ්ලේෂණය සහ ඖෂධ හඳුනාගැනීම',
    'features.voice.title': 'හඬ සහායක',
    'features.voice.description': 'බහු භාෂා හඬ මඟ පෙන්වීම සහ සහාය',
    'features.drugs.title': 'ඖෂධ තොරතුරු',
    'features.drugs.description': 'සවිස්තරාත්මක NMRA-අනුමත ඖෂධ දත්ත ගබඩාව',
    
    // Workflow
    'workflow.title': 'DigiFarmacy ක්‍රියා කරන ආකාරය',
    'workflow.step1': 'ෆාමසිය සොයන්න',
    'workflow.step2': 'බෙහෙත් වට්ටෝරුව උඩුගත කරන්න',
    'workflow.step3': 'දැනුම්දීම ලබා ගන්න',
    'workflow.step4': 'ඖෂධ එකතු කරන්න',
    'workflow.viewFull': 'සම්පූර්ණ ක්‍රියාවලිය බලන්න',
    
    // Common
    'common.loading': 'පූරණය වෙමින්...',
    'common.search': 'සෙවීම',
    'common.back': 'ආපසු',
    'common.next': 'ඊළඟ',
    'common.submit': 'ඉදිරිපත් කරන්න',
    'common.cancel': 'අවලංගු කරන්න',
  },
  ta: {
    // Header
    'nav.home': 'முகப்பு',
    'nav.pharmacies': 'மருந்தகங்கள்',
    'nav.labs': 'ஆய்வகங்கள்',
    'nav.drugs': 'மருந்து தகவல்',
    'nav.workflow': 'எப்படி வேலை செய்கிறது',
    
    // Hero Section
    'hero.title': 'AI-மேம்படுத்தப்பட்ட சுகாதார துணை',
    'hero.subtitle': 'புத்திசாலித்தனமான தொழில்நுட்பத்தின் மூலம் இலங்கை முழுவதும் சரிபார்க்கப்பட்ட மருந்தகங்கள் மற்றும் ஆய்வகங்களுடன் இணையுங்கள்',
    'hero.cta.primary': 'மருந்தகத்தைக் கண்டறியவும்',
    'hero.cta.secondary': 'மருந்து சீட்டைப் பதிவேற்றவும்',
    
    // Features
    'features.pharmacy.title': 'அருகிலுள்ள மருந்தகத்தைக் கண்டறியவும்',
    'features.pharmacy.description': 'நிகழ்நேர கிடைக்கும் தன்மையுடன் சரிபார்க்கப்பட்ட மருந்தகங்களைக் கண்டறியவும்',
    'features.scan.title': 'ஸ்மார்ட் மருந்து சீட்டு ஸ்கேன்',
    'features.scan.description': 'AI-இயங்கும் மருந்து சீட்டு பகுப்பாய்வு மற்றும் மருந்து அடையாளம்',
    'features.voice.title': 'குரல் உதவியாளர்',
    'features.voice.description': 'பல மொழி குரல் வழிகாட்டுதல் மற்றும் ஆதரவு',
    'features.drugs.title': 'மருந்து தகவல்',
    'features.drugs.description': 'விரிவான NMRA-அங்கீகரிக்கப்பட்ட மருந்து தரவுத்தளம்',
    
    // Workflow
    'workflow.title': 'DigiFarmacy எப்படி வேலை செய்கிறது',
    'workflow.step1': 'மருந்தகத்தைக் கண்டறியவும்',
    'workflow.step2': 'மருந்து சீட்டைப் பதிவேற்றவும்',
    'workflow.step3': 'அறிவிப்பைப் பெறவும்',
    'workflow.step4': 'மருந்தை எடுக்கவும்',
    'workflow.viewFull': 'முழு செயல்முறையைப் பார்க்கவும்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.search': 'தேடல்',
    'common.back': 'பின்',
    'common.next': 'அடுத்து',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.cancel': 'रद्द करें',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && storedLanguage !== currentLanguage) {
      setLanguage(storedLanguage);
    }
  }, [currentLanguage]);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};