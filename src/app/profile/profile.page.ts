import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  // Properti untuk menampung data user dari service
  user: User | null = null;

  // --- BAGIAN AVATAR YANG KITA KEMBALIKAN ---
  avatarOptions: string[] = [
    'person-circle-outline',
    'happy-outline',
    'game-controller-outline',
    'paw-outline',
    'bug-outline',
    'rocket-outline'
  ];
  currentAvatarIcon: string = this.avatarOptions[0];
  private currentAvatarIndex: number = 0;
  // --- END BAGIAN AVATAR ---

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  ionViewWillEnter() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.user = this.authService.getUser();
    console.log('User profile loaded from service:', this.user);
    
    // Setelah data user dimuat, muat juga preferensi avatar mereka
    if (this.user) {
      this.loadAvatarPreference();
    }
  }

  // --- FUNGSI BARU DAN LAMA UNTUK AVATAR ---
  loadAvatarPreference() {
    if (!this.user) return; // Pengaman jika user tidak ada

    // Kita simpan preferensi avatar dengan key yang unik untuk setiap user
    const avatarKey = `avatar_pref_${this.user.id}`;
    const savedAvatar = localStorage.getItem(avatarKey);

    if (savedAvatar && this.avatarOptions.includes(savedAvatar)) {
      this.currentAvatarIcon = savedAvatar;
      this.currentAvatarIndex = this.avatarOptions.indexOf(savedAvatar);
    } else {
      // Jika tidak ada preferensi, gunakan default
      this.currentAvatarIcon = this.avatarOptions[0];
      this.currentAvatarIndex = 0;
    }
  }

  changeAvatar() {
    this.currentAvatarIndex = (this.currentAvatarIndex + 1) % this.avatarOptions.length;
    this.currentAvatarIcon = this.avatarOptions[this.currentAvatarIndex];
    console.log('Changing avatar to:', this.currentAvatarIcon);

    // Simpan pilihan avatar baru ke localStorage
    if (this.user) {
      const avatarKey = `avatar_pref_${this.user.id}`;
      localStorage.setItem(avatarKey, this.currentAvatarIcon);
      console.log(`Avatar preference for user ${this.user.id} saved.`);
    }
  }
  // --- END FUNGSI AVATAR ---

  logout() {
    this.authService.logout();
  }

  goToChangePassword() {
    this.router.navigateByUrl('/change-password');
  }
}