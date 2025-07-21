
import React, { useState } from 'react';
import { Info, X, Mail, Phone, MapPin, Globe, Shield, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const MobileFooterPopup = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const footerSections = [
    {
      title: 'Quick Links',
      icon: Globe,
      items: [
        { label: 'How To Use', path: '/how-to-use', icon: HelpCircle },
        { label: 'Contact Us', path: '/contact', icon: Mail },
        { label: 'Lab Booking', path: '/lab-booking', icon: MapPin }
      ]
    },
    {
      title: 'Legal',
      icon: Shield,
      items: [
        { label: 'Privacy Policy (PDPA)', path: '/pdpa', icon: Shield },
        { label: 'Terms of Service', path: '/terms', icon: FileText }
      ]
    },
    {
      title: 'Contact Info',
      icon: Phone,
      items: [
        { label: 'support@farmafindr.lk', href: 'mailto:support@farmafindr.lk', icon: Mail },
        { label: '+94 77 123 4567', href: 'tel:+94771234567', icon: Phone }
      ]
    }
  ];

  const handleNavigation = (path?: string, href?: string) => {
    setIsOpen(false);
    if (path) {
      navigate(path);
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="rounded-full shadow-lg bg-slate-700 hover:bg-slate-800 text-white w-12 h-12 p-0"
          >
            <Info className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 medical-gradient rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              DigiFarmacy
            </DialogTitle>
            <DialogDescription>
              AI-Enhanced Health Companion for Sri Lanka
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {footerSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </div>
                
                <div className="space-y-1 pl-6">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => handleNavigation(item.path, item.href)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-slate-700 transition-colors w-full text-left py-1"
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Version</span>
                <Badge variant="outline" className="text-xs">v1.0.1</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Languages</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">EN</Badge>
                  <Badge variant="outline" className="text-xs">සි</Badge>
                  <Badge variant="outline" className="text-xs">த</Badge>
                </div>
              </div>
            </div>

            <div className="text-center pt-2 border-t">
              <p className="text-xs text-gray-500">
                © 2025 FarmaFinder. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Proudly serving Sri Lanka 🇱🇰
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileFooterPopup;
