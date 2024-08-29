import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarParkingConfigComponent } from './add-carparking-config.component';

describe('AddCarParkingConfigComponent', () => {
  let component: AddCarParkingConfigComponent;
  let fixture: ComponentFixture<AddCarParkingConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarParkingConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarParkingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
