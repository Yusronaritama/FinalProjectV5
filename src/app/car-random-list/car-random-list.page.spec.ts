import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRandomListPage } from './car-random-list.page';

describe('CarRandomListPage', () => {
  let component: CarRandomListPage;
  let fixture: ComponentFixture<CarRandomListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarRandomListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
