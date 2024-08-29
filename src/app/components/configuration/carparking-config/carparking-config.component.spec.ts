import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarParkingConfigComponent } from './carparking-config.component';

describe('CarParkingConfigComponent', () => {
  let component: CarParkingConfigComponent;
  let fixture: ComponentFixture<CarParkingConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarParkingConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarParkingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
