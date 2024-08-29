import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVehicleComponent } from './card-vehicle.component';

describe('CardVehicleComponent', () => {
  let component: CardVehicleComponent;
  let fixture: ComponentFixture<CardVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
