import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarDataService, CarModel } from '../services/car-data.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: false
})
export class CarListPage implements OnInit {

  public brandName: string = '';
  public carModels: CarModel[] = [];
  public isLoading: boolean = true;
  public isBrandFound: boolean = false;

  constructor(
    private route: ActivatedRoute, // Untuk membaca parameter dari URL
    private carDataService: CarDataService // Untuk mengambil data mobil
  ) { }

  ngOnInit() {
    // Ambil parameter 'brand' dari URL
    const brandFromRoute = this.route.snapshot.paramMap.get('brand');

    if (brandFromRoute) {
      // Mengubah huruf pertama menjadi besar untuk judul
      this.brandName = brandFromRoute.charAt(0).toUpperCase() + brandFromRoute.slice(1);
      
      // Panggil service untuk mendapatkan data mobil berdasarkan merek
      this.carModels = this.carDataService.getCarsByBrand(brandFromRoute);
      
      // Cek apakah data ditemukan
      if (this.carModels.length > 0) {
        this.isBrandFound = true;
      } else {
        this.isBrandFound = false;
        console.warn(`Data mobil untuk merek "${brandFromRoute}" tidak ditemukan.`);
      }
    } else {
        console.error('Parameter merek tidak ditemukan di URL.');
        this.isBrandFound = false;
    }

    this.isLoading = false;
  }
}