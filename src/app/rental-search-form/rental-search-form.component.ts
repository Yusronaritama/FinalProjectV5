import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO, add } from 'date-fns';

// Hapus semua import untuk modul seperti IonicModule, FormsModule, dll.

@Component({
  selector: 'app-rental-search-form',
  templateUrl: './rental-search-form.component.html',
  styleUrls: ['./rental-search-form.component.scss'],
  // --- PERUBAHAN UTAMA DI SINI ---
  standalone: false, // 1. Ubah menjadi false
  // 2. Hapus seluruh properti 'imports' dari sini
})
export class RentalSearchFormComponent implements OnInit {

  // ... (sisa isi class tidak berubah) ...
  driverOption = 'dengan-sopir';
  location = '';
  pickupDate = new Date().toISOString();
  durationInHours = 12;
  formattedPickupDate = '';
  formattedReturnDate = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { this.updateFormattedDates(); }
  onDateChange(event: any) { this.pickupDate = event.detail.value; this.updateFormattedDates(); }
  updateFormattedDates() {
    const pickup = parseISO(this.pickupDate);
    const returnDate = add(pickup, { hours: this.durationInHours });
    this.formattedPickupDate = format(pickup, 'EEE, d MMM');
    this.formattedReturnDate = format(returnDate, 'EEE, d MMM • HH:mm');
  }
  search() {
    const searchParams = { driverOption: this.driverOption, location: this.location, pickupDate: this.pickupDate, duration: this.durationInHours };
    this.modalCtrl.dismiss(searchParams);
  }
  dismissModal() { this.modalCtrl.dismiss(); }
}