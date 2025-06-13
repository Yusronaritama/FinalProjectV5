import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app', // ID Aplikasi Anda
  appName: 'FinalProject',   // Nama Aplikasi Anda
  webDir: 'www',             // Direktori aset web yang dikompilasi
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,     // Tampilkan splash screen selama 3 detik
      launchAutoHide: false,        // PENTING: Jangan sembunyikan otomatis, kita akan sembunyikan di kode
      backgroundColor: "#27ae60",   // Warna background splash screen (hijau GoRent All)
      androidSplashResourceName: "splash", // Nama resource gambar splash di Android (sesuai yang digenerate Ionic)
      androidScaleType: "CENTER_CROP", // Skala gambar splash
      showSpinner: false,           // Jangan tampilkan spinner default
      splashFullScreen: true,       // Splash screen mengambil layar penuh
      splashImmersive: true,        // Mode immersive untuk Android
      // iosSpinnerStyle: "small",    // Opsional: gaya spinner iOS jika showSpinner true
      // spinnerColor: "#ffffff",     // Opsional: warna spinner jika showSpinner true
    },
  },
};

export default config;
