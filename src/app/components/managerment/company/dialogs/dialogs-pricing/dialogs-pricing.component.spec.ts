import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsPricingComponent } from './dialogs-pricing.component';

describe('DialogsPricingComponent', () => {
  let component: DialogsPricingComponent;
  let fixture: ComponentFixture<DialogsPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogsPricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogsPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
