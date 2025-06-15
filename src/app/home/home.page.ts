import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular'; 
import { LocationPermissionModalComponent } from '../location-permission-modal/location-permission-modal.component'; 
import html2canvas from 'html2canvas'; // Import html2canvas library

// Interface for CarType model
interface CarType {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false // Assuming it's a non-standalone component for typical Ionic project setup
})
export class HomePage implements OnInit, OnDestroy {

  userId: string | null = null;
  
  // Static array for car types (placeholder data)
  carTypes: CarType[] = [
    { id: 'tesla', name: 'TESLA', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=TESLA' },
    { id: 'nissan', name: 'NISSAN', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=NISSAN' },
    { id: 'toyota', name: 'TOYOTA', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=TOYOTA' },
    { id: 'bmw', name: 'BMW', imageUrl: 'https://placehold.co/80x80/E0E0E0/white?text=BMW' },
    // Add more static car types here if desired
  ];
  selectedCarType: string | null = null; // To manage the active filter for car types

  // Get a reference to the ion-app element for screenshot capture
  // This assumes your ion-app tag in app.component.html has id="appRoot"
  @ViewChild('appRoot', { static: true }) appRoot!: ElementRef;

  constructor(
    private router: Router,
    private toastController: ToastController, 
    private modalController: ModalController,
    private elementRef: ElementRef // Inject ElementRef to potentially access native DOM elements
  ) { }

  ngOnInit() {
    // Initial logic for home page component
  }

  /**
   * Captures a screenshot of the application's current view,
   * applies a blur effect, and returns it as a data URL.
   * This is used as a fallback for `backdrop-filter` in environments
   * where it's not well-supported.
   * @returns Promise<string | null> A data URL of the blurred image or null if failed.
   */
  async captureAndBlurBackground(): Promise<string | null> {
    // Target the entire Ionic application element
    const appElement = document.querySelector('ion-app'); 

    if (!appElement) {
      console.error('ion-app element not found. Make sure it has id="appRoot" in app.component.html');
      return null;
    }

    try {
      // Add a small delay to ensure DOM is stable before capturing (e.g., after transitions)
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
      // Capture the screenshot using html2canvas
      const canvas = await html2canvas(appElement as HTMLElement, {
        allowTaint: true, // Allow cross-origin images to "taint" the canvas (may not be needed if images are local/CORS-enabled)
        useCORS: true,    // Attempt to load cross-origin images using CORS (important for external images)
        ignoreElements: (element) => {
          // Ignore the modal element itself if it somehow gets rendered before screenshot
          // This prevents the modal from blurring itself.
          return element.classList.contains('location-permission-modal');
        }
      });

      // Create an offscreen canvas to apply the blur effect
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const ctx = offscreenCanvas.getContext('2d');

      if (ctx) {
        ctx.filter = 'blur(10px)'; // Apply a CSS blur filter to the drawing context
        ctx.drawImage(canvas, 0, 0); // Draw the captured screenshot onto the offscreen canvas with blur
        return offscreenCanvas.toDataURL('image/png'); // Get the data URL of the blurred image
      }
      return null; // Return null if canvas context is not available

    } catch (error) {
      console.error('Failed to capture or blur screenshot:', error);
      this.presentToast('Failed to load background. Please try again.', 'danger');
      return null; // Return null on error
    }
  }

  /**
   * Displays the custom location permission modal.
   * It first captures a blurred screenshot of the background and passes it to the modal.
   */
  async requestLocationPermission() {
    // Check if Geolocation API is supported by the browser/device
    if (!navigator.geolocation) {
      this.presentToast('Geolocation is not supported by this browser/device.', 'danger');
      return;
    }

    // Capture the blurred background image
    const blurredBgImage = await this.captureAndBlurBackground();

    // Create the modal instance
    const modal = await this.modalController.create({
      component: LocationPermissionModalComponent, // Use the custom modal component
      cssClass: 'location-permission-modal', // Custom CSS class for the modal wrapper
      // Remove initialBreakpoint and breakpoints to disable swipe-to-close behavior
      // initialBreakpoint: 0.5, 
      // breakpoints: [0, 0.5, 0.8, 1], 
      backdropDismiss: false, // Prevent modal from dismissing when clicking outside
      componentProps: {
        blurredBackgroundImage: blurredBgImage // Pass the blurred image data URL to the modal
      }
    });

    // Present the modal
    await modal.present();

    // Listen for modal dismissal and get returned data/role
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('User confirmed location permission from modal.');
      this.getCurrentLocation(); // Proceed to get the location
    } else if (role === 'cancel') {
      console.log('User denied location permission from modal.');
      this.presentToast('Location permission denied.', 'warning');
    }
  }

  /**
   * Attempts to get the current geolocation of the device.
   */
  getCurrentLocation() {
    this.presentToast('Attempting to get your location...', 'primary');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Location obtained: Latitude ${latitude}, Longitude ${longitude}`);
        this.presentToast(`Location obtained: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'success');
        // Here you can store the location or process it further
        // Example: this.currentLocation = `Lat: ${latitude}, Lon: ${longitude}`;
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied by the user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        this.presentToast(errorMessage, 'danger');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /**
   * Helper method to present a Toast message.
   * @param message The message to display in the toast.
   * @param color The color of the toast (e.g., 'dark', 'primary', 'success', 'danger').
   */
  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  /**
   * Handles the selection of a car type for filtering purposes.
   * @param carTypeName The name of the selected car type.
   */
  selectCarType(carTypeName: string) {
    this.selectedCarType = carTypeName;
    console.log('Selected car type:', this.selectedCarType);
    // Logic to filter popular cars would depend on local data or another data source here.
  }

  ngOnDestroy() {
    // Cleanup if any subscriptions or listeners exist (currently none from Firestore)
  }

  /**
   * Navigates to the user profile page.
   */
  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

}
