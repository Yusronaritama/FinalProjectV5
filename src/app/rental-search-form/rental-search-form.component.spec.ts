import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

// Ubah import ini dari '...sear.component'
import { RentalSearchFormComponent } from './rental-search-form.component';

describe('RentalSearchFormComponent', () => {
  let component: RentalSearchFormComponent;
  let fixture: ComponentFixture<RentalSearchFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // Ubah deklarasi ini dari '...searComponent'
      declarations: [ RentalSearchFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RentalSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});