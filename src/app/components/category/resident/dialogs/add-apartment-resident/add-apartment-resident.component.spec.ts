import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApartmentResidentComponent } from './add-apartment-resident.component';

describe('AddApartmentResidentComponent', () => {
  let component: AddApartmentResidentComponent;
  let fixture: ComponentFixture<AddApartmentResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApartmentResidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApartmentResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
