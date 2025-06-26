import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit, OnDestroy {

  public user: User | null = null;
  public selectedAvatar: string = 'person-circle-outline';
  private avatarSubscription!: Subscription;

  public editData = {
    nomor_telepon: '',
    alamat: '',
    tanggal_lahir: new Date().toISOString()
  };

  public avatarList = [
    'person-circle-outline', 'happy-outline', 'game-controller-outline', 
    'paw-outline', 'bug-outline', 'rocket-outline', 
    'hardware-chip-outline', 'color-palette-outline'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.editData.nomor_telepon = this.user.nomor_telepon;
      this.editData.alamat = this.user.alamat;
      this.editData.tanggal_lahir = this.user.tanggal_lahir;
    }
    
    this.avatarSubscription = this.authService.currentAvatar$.subscribe(avatar => {
      this.selectedAvatar = avatar;
    });
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
  }
  
  ngOnDestroy() {
    if (this.avatarSubscription) { this.avatarSubscription.unsubscribe(); }
  }
  
  selectAvatar(iconName: string) {
    this.authService.updateAvatar(iconName);
  }

  async updateProfile() {
    const loading = await this.loadingCtrl.create({ message: 'Menyimpan...' });
    await loading.present();

    this.authService.updateUserProfile(this.editData).subscribe({
      next: (response) => {
        loading.dismiss();
        this.presentToast('Profil berhasil diperbarui', 'success');
        this.user = this.authService.getUser();
      },
      error: (err) => {
        loading.dismiss();
        this.presentToast('Gagal memperbarui profil. Coba lagi.', 'danger');
        console.error(err);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }

  logout() { this.authService.logout(); }
  goToChangePassword() { this.router.navigateByUrl('/change-password'); }
  goToSettings() { this.router.navigateByUrl('/settings'); }
}