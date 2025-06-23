import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalCustomPage } from './rental-custom.page';

describe('RentalCustomPage', () => {
  let component: RentalCustomPage;
  let fixture: ComponentFixture<RentalCustomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalCustomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
