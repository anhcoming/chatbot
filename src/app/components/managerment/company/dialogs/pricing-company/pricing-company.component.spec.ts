import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingCompanyComponent } from './pricing-company.component';

describe('PricingCompanyComponent', () => {
  let component: PricingCompanyComponent;
  let fixture: ComponentFixture<PricingCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
