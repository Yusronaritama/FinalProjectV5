import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QnaPage } from './qna.page';

describe('QnaPage', () => {
  let component: QnaPage;
  let fixture: ComponentFixture<QnaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
