import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.page.html',
  styleUrls: ['./loading-screen.page.scss'],
  standalone: false
})
export class LoadingScreenPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Panggil logika untuk transisi setelah loading selesai
    this.startLoadingSequence();
  }

  startLoadingSequence() {
    // Durasi total animasi loading, sesuaikan dengan animasi CSS Anda
    // Misalnya, 2.5 detik untuk animasi loading bar dan sedikit delay setelahnya
    const loadingDuration = 3000; // 3 detik

    setTimeout(() => {
      // Setelah durasi loading selesai, navigasi ke halaman home
      // replaceUrl: true akan mencegah pengguna kembali ke loading screen dengan tombol back
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }, loadingDuration);
  }
}
