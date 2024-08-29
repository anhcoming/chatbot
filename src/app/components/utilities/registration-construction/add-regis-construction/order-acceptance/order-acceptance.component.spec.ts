import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAcceptanceComponent } from './order-acceptance.component';

describe('OrderAcceptanceComponent', () => {
  let component: OrderAcceptanceComponent;
  let fixture: ComponentFixture<OrderAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderAcceptanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
