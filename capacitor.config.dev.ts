import type { CapacitorConfig } from '@capacitor/cli';
import { baseConfig } from './capacitor.config';

const config: CapacitorConfig = {
  ...baseConfig,
  server: {
    url: 'http://192.168.1.7:3000',
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;