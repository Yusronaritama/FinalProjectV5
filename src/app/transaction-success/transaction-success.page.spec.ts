import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionSuccessPage } from './transaction-success.page';

describe('TransactionSuccessPage', () => {
  let component: TransactionSuccessPage;
  let fixture: ComponentFixture<TransactionSuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
