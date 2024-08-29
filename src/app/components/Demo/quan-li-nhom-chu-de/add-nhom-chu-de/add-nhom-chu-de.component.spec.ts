import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNhomChuDeComponent } from './add-nhom-chu-de.component';

describe('AddNhomChuDeComponent', () => {
  let component: AddNhomChuDeComponent;
  let fixture: ComponentFixture<AddNhomChuDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNhomChuDeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNhomChuDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
