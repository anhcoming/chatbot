import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentComponent } from './deposit-payment.component';

describe('DepositPaymentComponent', () => {
  let component: DepositPaymentComponent;
  let fixture: ComponentFixture<DepositPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
