import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuanLiChuDeComponent } from './add-quan-li-chu-de.component';

describe('AddQuanLiChuDeComponent', () => {
  let component: AddQuanLiChuDeComponent;
  let fixture: ComponentFixture<AddQuanLiChuDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuanLiChuDeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuanLiChuDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
