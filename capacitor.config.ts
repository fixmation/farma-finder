
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4c679b99274d4b6f9fde5fd5532a8b98',
  appName: 'PharmFinder - Your Health Companion',
  webDir: 'dist',
  server: {
    url: 'https://4c679b99-274d-4b6f-9fde-5fd5532a8b98.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;
