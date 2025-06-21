import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarDataService, CarModel } from '../services/car-data.service';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.page.html',
  styleUrls: ['./rental-detail.page.scss'],
  standalone: false
})
export class RentalDetailPage implements OnInit {

  car: CarModel | undefined;

  constructor(
    private route: ActivatedRoute,
    private carDataService: CarDataService
  ) { }

  ngOnInit() {
    const brand = this.route.snapshot.paramMap.get('brand');
    const carId = this.route.snapshot.paramMap.get('carId');

    if (brand && carId) {
      this.car = this.carDataService.getCarDetails(brand, carId);
    }
  }
}