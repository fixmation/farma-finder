
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Shield, Settings } from 'lucide-react';
import FixmationLogo from './FixmationLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">FarmaFinder</h3>
                <p className="text-white/70 text-sm">AI-Enhanced Health Companion</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              Connecting patients with verified pharmacies across Sri Lanka through intelligent technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-white/80 hover:text-white transition-colors text-sm">
                Find Pharmacies
              </Link>
              <Link to="/" className="block text-white/80 hover:text-white transition-colors text-sm">
                Prescription Scanner
              </Link>
              <Link to="/" className="block text-white/80 hover:text-white transition-colors text-sm">
                Voice Assistant
              </Link>
              <Link to="/" className="block text-white/80 hover:text-white transition-colors text-sm">
                Drug Information
              </Link>
              <Link to="/how-to-use" className="block text-white/80 hover:text-white transition-colors text-sm">
                How To Use
              </Link>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal & Privacy</h4>
            <div className="space-y-2">
              <Link 
                to="/pdpa" 
                className="block text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Sri Lanka's PDPA
              </Link>
              <Link to="/privacy" className="block text-white/80 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-white/80 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/contact" className="block text-white/80 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>Email: support@farmafinder.lk</p>
              <p>Phone: +94 11 123 4567</p>
              <p>Address: Hanyu Pharmacy, Puttalam 61300, Sri Lanka</p>
              <Link 
                to="/admin-auth"
                className="flex items-center gap-2 pt-2 text-white/60 hover:text-white/80 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs">Admin Access</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm">
              © 2025 FarmaFinder. All rights reserved. | Compliant with Sri Lanka's PDPA
            </div>
            <div className="text-white/60 text-xs">
              Built with ❤️ for the people of Sri Lanka
            </div>
          </div>
          
          {/* Innovation and Hosting Information */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <span className="text-white/60 flex items-left gap-1" style={{ fontSize: '0.7rem' }}>
              Innovation By:{' '}
              <a 
                href="https://fixmation.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <FixmationLogo />
                Fixmation Technologies
              </a>
            </span>
            <span className="text-white/60" style={{ fontSize: '0.7rem' }}>
              Hosted By: Hanyu Pharmacy, NMRA Registration #:
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
