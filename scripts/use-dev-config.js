const fs = require('fs');
const path = require('path');

// Get the local IP address
function getLocalIpAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (loopback) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '192.168.1.100'; // Default fallback
}

// Create the development configuration
const createDevConfig = () => {
    const localIp = getLocalIpAddress();

    const devConfig = `import type { CapacitorConfig } from '@capacitor/cli';
import { baseConfig } from './capacitor.config';

const config: CapacitorConfig = {
  ...baseConfig,
  server: {
    url: 'http://${localIp}:3000',
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;`;

    fs.writeFileSync(path.resolve(__dirname, '../capacitor.config.dev.ts'), devConfig);

    // Copy the dev config to be the active one
    fs.copyFileSync(
        path.resolve(__dirname, '../capacitor.config.dev.ts'),
        path.resolve(__dirname, '../capacitor.config.ts')
    );

    console.log(`Development configuration activated with IP: ${localIp}`);
};

createDevConfig(); 