import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCardInformationComponent } from './vehicle-card-information.component';

describe('VehicleCardInformationComponent', () => {
  let component: VehicleCardInformationComponent;
  let fixture: ComponentFixture<VehicleCardInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleCardInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCardInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
