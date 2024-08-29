import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhanDangKhuonMatComponent } from './nhan-dang-khuon-mat.component';

describe('NhanDangKhuonMatComponent', () => {
  let component: NhanDangKhuonMatComponent;
  let fixture: ComponentFixture<NhanDangKhuonMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhanDangKhuonMatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhanDangKhuonMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
