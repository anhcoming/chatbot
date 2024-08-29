import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicePricingComponent } from './add-service-pricing.component';

describe('AddServicePricingComponent', () => {
  let component: AddServicePricingComponent;
  let fixture: ComponentFixture<AddServicePricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServicePricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServicePricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
