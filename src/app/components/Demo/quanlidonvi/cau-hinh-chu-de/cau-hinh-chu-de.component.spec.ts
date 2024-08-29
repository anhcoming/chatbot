import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHinhChuDeComponent } from './cau-hinh-chu-de.component';

describe('CauHinhChuDeComponent', () => {
  let component: CauHinhChuDeComponent;
  let fixture: ComponentFixture<CauHinhChuDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauHinhChuDeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CauHinhChuDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
