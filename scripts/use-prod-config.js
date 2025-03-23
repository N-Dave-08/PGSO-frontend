const fs = require('fs');
const path = require('path');

// Create the production configuration
const createProdConfig = () => {
    const prodConfig = `import type { CapacitorConfig } from '@capacitor/cli';

export const baseConfig: CapacitorConfig = {
  appId: 'com.pgso.app',
  appName: 'PGSO App',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default baseConfig;`;

    fs.writeFileSync(path.resolve(__dirname, '../capacitor.config.prod.ts'), prodConfig);

    // Copy the prod config to be the active one
    fs.copyFileSync(
        path.resolve(__dirname, '../capacitor.config.prod.ts'),
        path.resolve(__dirname, '../capacitor.config.ts')
    );

    console.log('Production configuration activated');
};

createProdConfig(); 