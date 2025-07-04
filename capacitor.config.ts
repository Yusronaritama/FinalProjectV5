import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gorentall.app', // Sesuaikan dengan ID aplikasi Anda
  appName: 'GoRentAll',       // Sesuaikan dengan nama aplikasi Anda
  webDir: 'www',
  // --- TAMBAHKAN ATAU PASTIKAN BLOK INI ADA ---
  server: {
    androidScheme: 'https',
  }
  // ------------------------------------------
};

export default config;