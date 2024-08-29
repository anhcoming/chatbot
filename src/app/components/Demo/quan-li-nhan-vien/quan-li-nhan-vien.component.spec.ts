import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLiNhanVienComponent } from './quan-li-nhan-vien.component';

describe('QuanLiNhanVienComponent', () => {
  let component: QuanLiNhanVienComponent;
  let fixture: ComponentFixture<QuanLiNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLiNhanVienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLiNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
