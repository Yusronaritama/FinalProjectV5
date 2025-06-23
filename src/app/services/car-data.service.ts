import { Injectable } from '@angular/core';

export interface CarModel {
  id: string;
  name: string;
  year: number;
  type: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  images: string[];
  specs: {
    seats: number;
    fuel: 'Petrol' | 'Diesel' | 'Electric';
    transmission: 'Automatic' | 'Manual';
    ac: boolean;
  };
  rentalOptions: {
    duration: string;
    desc: string;
    price: number;
  }[];
  description: string;
  securityDeposit: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private carData: { [key: string]: CarModel[] } = {
    'wuling': [
      {
        id: 'wuling-air-ev',
        name: 'Wuling Air EV',
        year: 2024, type: 'Electric', price: 250000, isAvailable: true,
        imageUrl: 'assets/image/tank.jpeg',
        images: ['assets/image/tank.jpeg'],
        specs: { seats: 4, fuel: 'Electric', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 250000 },
          { duration: '3 Days', desc: 'Weekend package', price: 700000 } // <-- DITAMBAHKAN
        ],
        description: 'Mobil listrik mungil yang lincah untuk perkotaan.',
        securityDeposit: 500000
      }
    ],
    'bmw': [
      {
        id: 'bmw-x5-2024',
        name: 'BMW X5',
        year: 2024, type: 'SUV', price: 1200000, isAvailable: true,
        imageUrl: 'assets/image/tank.jpeg',
        images: ['assets/image/tank.jpeg'],
        specs: { seats: 5, fuel: 'Diesel', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 1200000 },
          { duration: '3 Days', desc: 'Weekend package', price: 3500000 } // <-- DITAMBAHKAN
        ],
        description: 'Rasakan kemewahan dan performa dengan BMW X5 terbaru.',
        securityDeposit: 2000000
      }
    ],
    'hino': [
      {
        id: 'hino-dutro',
        name: 'Hino Dutro',
        year: 2023, type: 'Light Duty Truck', price: 600000, isAvailable: true,
        imageUrl: 'assets/cars/hino_dutro.jpg',
        images: ['assets/cars/hino_dutro.jpg'],
        specs: { seats: 3, fuel: 'Diesel', transmission: 'Manual', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 600000 },
          { duration: '3 Days', desc: 'Weekend package', price: 1700000 } // <-- DITAMBAHKAN
        ],
        description: 'Truk ringan yang handal untuk segala kebutuhan bisnis Anda.',
        securityDeposit: 1000000
      }
    ],
    'honda': [
       {
        id: 'honda-crv',
        name: 'Honda CR-V',
        year: 2024, type: 'SUV', price: 450000, isAvailable: true,
        imageUrl: 'assets/cars/honda_crv.jpg',
        images: ['assets/cars/honda_crv.jpg'],
        specs: { seats: 7, fuel: 'Petrol', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 450000 },
          { duration: '3 Days', desc: 'Weekend package', price: 1300000 } // <-- DITAMBAHKAN
        ],
        description: 'SUV keluarga yang nyaman dan dilengkapi fitur canggih.',
        securityDeposit: 750000
      }
    ],
    'hyundai': [
       {
        id: 'hyundai-ioniq5',
        name: 'Hyundai Ioniq 5',
        year: 2024, type: 'Electric Crossover', price: 650000, isAvailable: true,
        imageUrl: 'assets/cars/hyundai_ioniq5.jpg',
        images: ['assets/cars/hyundai_ioniq5.jpg'],
        specs: { seats: 5, fuel: 'Electric', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 650000 },
          { duration: '3 Days', desc: 'Weekend package', price: 1850000 } // <-- DITAMBAHKAN
        ],
        description: 'Crossover listrik dengan desain futuristik dan interior yang luas.',
        securityDeposit: 1000000
      }
    ],
    'isuzu': [
       {
        id: 'isuzu-mux',
        name: 'Isuzu MU-X',
        year: 2024, type: 'SUV', price: 480000, isAvailable: false,
        imageUrl: 'assets/cars/isuzu_mux.jpg',
        images: ['assets/cars/isuzu_mux.jpg'],
        specs: { seats: 7, fuel: 'Diesel', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 480000 },
          { duration: '3 Days', desc: 'Weekend package', price: 1400000 } // <-- DITAMBAHKAN
        ],
        description: 'SUV tangguh dengan mesin diesel yang efisien dan bertenaga.',
        securityDeposit: 750000
      }
    ],
    'mitsubishi': [
       {
        id: 'mitsubishi-pajero',
        name: 'Mitsubishi Pajero Sport',
        year: 2024, type: 'SUV', price: 550000, isAvailable: true,
        imageUrl: 'assets/cars/mitsubishi_pajero.jpg',
        images: ['assets/cars/mitsubishi_pajero.jpg'],
        specs: { seats: 7, fuel: 'Diesel', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 550000 },
          { duration: '3 Days', desc: 'Weekend package', price: 1600000 } // <-- DITAMBAHKAN
        ],
        description: 'SUV legendaris yang siap menemani petualangan Anda di segala medan.',
        securityDeposit: 1000000
      }
    ],
    'suzuki': [
       {
        id: 'suzuki-jimny',
        name: 'Suzuki Jimny',
        year: 2024, type: 'Off-road SUV', price: 400000, isAvailable: false,
        imageUrl: 'assets/cars/suzuki_jimny.jpg',
        images: ['assets/cars/suzuki_jimny.jpg'],
        specs: { seats: 4, fuel: 'Petrol', transmission: 'Manual', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 400000 },
          { duration: '3 Days', desc: 'Weekend package', price: 1150000 } // <-- DITAMBAHKAN
        ],
        description: 'Jelajahi medan sulit dengan SUV off-road ikonik yang tangguh.',
        securityDeposit: 750000
      }
    ],
    'toyota': [
      {
        id: 'toyota-avanza',
        name: 'Toyota Avanza',
        year: 2024, type: 'MPV', price: 275000, isAvailable: true,
        imageUrl: 'assets/cars/toyota_avanza.jpg',
        images: ['assets/cars/toyota_avanza.jpg', 'assets/cars/avanza_interior.jpg', 'assets/cars/avanza_back.jpg'],
        specs: { seats: 7, fuel: 'Petrol', transmission: 'Automatic', ac: true },
        rentalOptions: [
          { duration: '24 Hours', desc: 'Full day rental', price: 275000 },
          { duration: '3 Days', desc: 'Weekend package', price: 800000 },
        ],
        description: 'Toyota Avanza 2024 dengan kondisi prima. Irit bahan bakar, interior nyaman, dan pengalaman berkendara yang mulus.',
        securityDeposit: 500000
      }
    ]
  };

  constructor() { }

  getCarsByBrand(brand: string): CarModel[] {
    const brandKey = brand.toLowerCase();
    return this.carData[brandKey] || [];
  }

  getCarDetails(brand: string, carId: string): CarModel | undefined {
    const brandCars = this.getCarsByBrand(brand);
    return brandCars.find(car => car.id === carId);
  }
}