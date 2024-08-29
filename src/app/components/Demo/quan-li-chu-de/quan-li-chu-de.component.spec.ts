import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLiChuDeComponent } from './quan-li-chu-de.component';

describe('QuanLiChuDeComponent', () => {
  let component: QuanLiChuDeComponent;
  let fixture: ComponentFixture<QuanLiChuDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLiChuDeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLiChuDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
