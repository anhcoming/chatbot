import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadApartmentComponent } from './upload-apartment.component';

describe('UploadApartmentComponent', () => {
  let component: UploadApartmentComponent;
  let fixture: ComponentFixture<UploadApartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadApartmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
