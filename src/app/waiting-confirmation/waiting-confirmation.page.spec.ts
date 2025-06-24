import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitingConfirmationPage } from './waiting-confirmation.page';

describe('WaitingConfirmationPage', () => {
  let component: WaitingConfirmationPage;
  let fixture: ComponentFixture<WaitingConfirmationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
