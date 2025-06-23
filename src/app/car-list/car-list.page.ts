// TAMBAHKAN KEMBALI @Component
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle, VehicleService } from '../services/vehicle.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: false // Pastikan ini false jika Anda menggunakan Ionic dengan Angular
})
export class CarListPage implements OnInit {

  public pageTitle: string = 'Daftar Mobil';
  public allVehicles: Vehicle[] = [];
  public filteredVehicles: Vehicle[] = [];
  public isLoading: boolean = true;
  public brandName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.brandName = this.route.snapshot.paramMap.get('brand');
    if (this.brandName) {
      this.pageTitle = this.brandName.charAt(0).toUpperCase() + this.brandName.slice(1);
    }
    this.loadVehicles();
  }

  async loadVehicles() {
    const loading = await this.loadingController.create({ message: 'Memuat data...' });
    await loading.present();

    // Menambahkan tipe data pada response untuk menghilangkan error 'any'
    this.vehicleService.getAllVehicles().subscribe({
      next: (response: { data: Vehicle[] }) => {
        this.allVehicles = response.data;
        if (this.brandName) {
          this.filteredVehicles = this.allVehicles.filter(
            vehicle => vehicle.merk.toLowerCase() === this.brandName!.toLowerCase()
          );
        } else {
          this.filteredVehicles = this.allVehicles;
        }
        loading.dismiss();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Gagal memuat data kendaraan:', err);
        loading.dismiss();
        this.isLoading = false;
      }
    });
  }
  
  goToDetail(vehicleId: number) {
    this.router.navigate(['/car-detail', vehicleId]);
  }
}