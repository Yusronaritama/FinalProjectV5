import { Component, OnInit, ViewChild } from '@angular/core'; // Import ViewChild
import { Router } from '@angular/router';
import { AlertController, IonModal } from '@ionic/angular'; // Import IonModal

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  // Mendapatkan referensi ke komponen modal di HTML
  @ViewChild('dateModal') dateModal!: IonModal;

  // Properti form
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  currentLocation: string = '';
  birthDate: string = '';
  ktpPhotoBase64: string | null = null;
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  /**
   * Fungsi baru untuk membuka modal kalender secara manual.
   * Fungsi ini akan dipanggil oleh tombol di HTML.
   */
  openCalendar() {
    this.dateModal.present();
  }

  // Fungsi untuk menutup modal setelah tanggal dipilih (opsional tapi bagus)
  onDateSelect() {
    this.dateModal.dismiss();
  }


  onKtpFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { this.ktpPhotoBase64 = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }

  removeKtpPhoto() {
    this.ktpPhotoBase64 = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) { fileInput.value = ''; }
  }

  async doRegister() {
    if (this.password !== this.confirmPassword) {
      this.presentAlert('Error', 'Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    if (!this.fullName || !this.phoneNumber || !this.email || !this.currentLocation || !this.birthDate || !this.ktpPhotoBase64 || !this.password) {
      this.presentAlert('Error', 'Harap isi semua kolom yang wajib diisi dan unggah foto KTP.');
      return;
    }

    const newUser = {
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      currentLocation: this.currentLocation,
      birthDate: this.birthDate,
      ktpPhoto: this.ktpPhotoBase64,
      password: this.password,
      avatarIcon: 'person-circle-outline'
    };

    let registeredUsers: any[] = [];
    const storedUsersString = localStorage.getItem('registeredUsers');
    if (storedUsersString) {
      registeredUsers = JSON.parse(storedUsersString);
    }

    if (registeredUsers.some(user => user.email === newUser.email)) {
      this.presentAlert('Error', 'Email sudah terdaftar. Silakan login atau gunakan email lain.');
      return;
    }

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    await this.presentAlert('Sukses', 'Registrasi berhasil! Anda sekarang bisa login.');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}