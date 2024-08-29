import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLiNhomChuDeComponent } from './quan-li-nhom-chu-de.component';

describe('QuanLiNhomChuDeComponent', () => {
  let component: QuanLiNhomChuDeComponent;
  let fixture: ComponentFixture<QuanLiNhomChuDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLiNhomChuDeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLiNhomChuDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
