import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarDataService, CarModel } from '../services/car-data.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: false
})
export class CarDetailPage implements OnInit, OnDestroy {
  
  car: CarModel | undefined;
  brand: string = ''; // <-- PROPERTI BARU UNTUK MENYIMPAN MEREK
  private routeSub: Subscription | undefined;

  constructor(
  /**
   * Construct a CarDetailPage component.
   *
   * @param route injected ActivatedRoute from Angular router.
   * This is used to get the brand and carId from the URL parameter.
   * @param carDataService injected CarDataService. This is used to get the car details.
   */
    private route: ActivatedRoute,
    private carDataService: CarDataService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const brandParam = params.get('brand');
      const carIdParam = params.get('carId');

      if (brandParam && carIdParam) {
        this.brand = brandParam; // <-- SIMPAN MEREK DARI URL KE PROPERTI
        this.car = this.carDataService.getCarDetails(brandParam, carIdParam);
      } else {
        console.error('Brand atau Car ID tidak ditemukan di parameter URL.');
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}