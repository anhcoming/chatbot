import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentConfigComponent } from './add-payment-config.component';

describe('AddPaymentConfigComponent', () => {
  let component: AddPaymentConfigComponent;
  let fixture: ComponentFixture<AddPaymentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
