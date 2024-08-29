import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardVehicleComponent } from './add-card-vehicle.component';

describe('AddCardVehicleComponent', () => {
  let component: AddCardVehicleComponent;
  let fixture: ComponentFixture<AddCardVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCardVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
