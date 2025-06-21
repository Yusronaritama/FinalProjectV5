import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',

  templateUrl: './register.page.html',

  styleUrls: ['./register.page.scss'],
  standalone: false 
})
export class RegisterPage implements OnInit { 

  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  currentLocation: string = '';
  birthDate: string = ''; // Properti untuk menyimpan tanggal ISO (akan diisi dari input manual)
  formattedBirthDate: string = ''; // Properti untuk menampilkan tanggal dalam format DD/MM/YYYY
  ktpPhotoBase64: string | null = null; 
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  /**
   * Menangani perubahan tanggal dari input teks manual.
   * Memvalidasi dan memformat tanggal yang dimasukkan ke format DD/MM/YYYY.
   * Mengisi properti birthDate (ISO) berdasarkan input manual.
   */
  onManualDateChange() { // METODE DIPERBARUI untuk input manual
    const dateInput = this.formattedBirthDate;
    // Regex sederhana untuk format DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/; 

    if (dateRegex.test(dateInput)) {
      const parts = dateInput.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Membuat objek Date (bulan dimulai dari 0)
      const dateObj = new Date(year, month - 1, day);

      // Periksa apakah tanggal yang dimasukkan valid (misalnya, 31/02/2023 akan menjadi 02/03/2023 tanpa validasi ini)
      if (dateObj.getFullYear() === year && (dateObj.getMonth() + 1) === month && dateObj.getDate() === day) {
        this.birthDate = dateObj.toISOString(); // Simpan dalam format ISO 8601
        console.log('Valid Date (formatted):', this.formattedBirthDate);
        console.log('Valid Date (ISO):', this.birthDate);
      } else {
        // Tanggal tidak valid (misalnya 31 Februari)
        console.warn('Invalid date entered:', dateInput);
        this.birthDate = ''; // Kosongkan jika tidak valid
      }
    } else {
      console.warn('Date format is incorrect. Please use DD/MM/YYYY.');
      this.birthDate = ''; // Kosongkan jika format salah
    }
  }

  /**
   * Menangani pemilihan file KTP.
   * Mengkonversi file yang dipilih menjadi string Base64 untuk pratinjau dan penyimpanan.
   * @param event Event dari input file (change event).
   */
  onKtpFileSelected(event: any) { 
    const file: File = event.target.files[0];
    if (file) {
      this.simFile = file; // Buat preview untuk ditampilkan di UI

      const reader = new FileReader();
      reader.onload = () => {
        this.ktpPhotoBase64 = reader.result as string;
        console.log('KTP Photo selected (Base64):', this.ktpPhotoBase64.substring(0, 50) + '...'); 
      };
      reader.readAsDataURL(file); 
    } else {
      this.ktpPhotoBase64 = null;
    }
  }

  /**
   * Menghapus foto KTP yang sudah dipilih.
   */
  removeKtpPhoto() { 
    this.ktpPhotoBase64 = null;
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    console.log('KTP Photo removed.');
  }

  doRegister() {
    console.log('Attempting Registration...');
    
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!'); 
      return;
    }

    // Validasi semua field yang dibutuhkan, termasuk ktpPhotoBase64 dan formattedBirthDate
    if (!this.fullName || !this.phoneNumber || !this.email || !this.currentLocation || !this.formattedBirthDate || !this.ktpPhotoBase64 || !this.password) {
      alert('Please fill in all required fields and upload KTP photo.'); 
      return;
    }

    // Pastikan tanggal lahir yang dimasukkan valid sebelum mendaftar
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(this.formattedBirthDate)) {
        alert('Please enter a valid date of birth in DD/MM/YYYY format.');
        return;
    }

    const newUser = {
      fullName: this.fullName,
      phoneNumber: this.phoneNumber, 
      email: this.email,
      currentLocation: this.currentLocation,
      formattedBirthDate: this.formattedBirthDate, 
      birthDateISO: this.birthDate, // Ini akan berisi ISO string jika valid
      ktpPhoto: this.ktpPhotoBase64, 
      password: this.password 
    };

    let registeredUsers: any[] = [];
    const storedUsersString = localStorage.getItem('registeredUsers');

    if (storedUsersString) {
      try {
        registeredUsers = JSON.parse(storedUsersString);
      } catch (e) {
        console.error('Error parsing existing users from localStorage. Clearing corrupted data.', e);
        localStorage.removeItem('registeredUsers'); 
        registeredUsers = []; 
      }
    }

    if (registeredUsers.some(user => user.email === newUser.email)) {
      alert('Email already registered. Please login or use a different email.'); 
      return;
    }

    registeredUsers.push(newUser);
    const finalUsersString = JSON.stringify(registeredUsers);
    localStorage.setItem('registeredUsers', finalUsersString);
    console.log('New user registered. Final string saved to localStorage:', finalUsersString); 
    console.log('Object saved:', newUser); 

    alert('Registration successful! You can now log in.'); 
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