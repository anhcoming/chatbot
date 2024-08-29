import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoiDapChuyenNganhComponent } from './hoi-dap-chuyen-nganh.component';

describe('HoiDapChuyenNganhComponent', () => {
  let component: HoiDapChuyenNganhComponent;
  let fixture: ComponentFixture<HoiDapChuyenNganhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoiDapChuyenNganhComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoiDapChuyenNganhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
