import { Component, OnInit, Input } from '@angular/core'; // Import Input decorator
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-location-permission-modal',
  templateUrl: './location-permission-modal.component.html',
  styleUrls: ['./location-permission-modal.component.scss'],
  standalone: false
})
export class LocationPermissionModalComponent implements OnInit {

  @Input() blurredBackgroundImage: string | null = null; // Input property to receive the blurred image data URL

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // You can log the received image data here for debugging
    // console.log('Blurred Image Received in modal:', this.blurredBackgroundImage ? 'Yes' : 'No');
  }

  /**
   * Dismisses the modal with a 'confirm' role when the "Allow" button is clicked.
   */
  confirm() {
    this.modalController.dismiss(null, 'confirm'); // Dismiss modal with 'confirm' role
  }

  /**
   * Dismisses the modal with a 'cancel' role when the "Later" button is clicked.
   */
  cancel() {
    this.modalController.dismiss(null, 'cancel'); // Dismiss modal with 'cancel' role
  }
}
