import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHinhNhanVienComponent } from './cau-hinh-nhan-vien.component';

describe('CauHinhNhanVienComponent', () => {
  let component: CauHinhNhanVienComponent;
  let fixture: ComponentFixture<CauHinhNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauHinhNhanVienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CauHinhNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
