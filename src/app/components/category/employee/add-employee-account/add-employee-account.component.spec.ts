import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeAccountComponent } from './add-employee-account.component';

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeAccountComponent;
  let fixture: ComponentFixture<AddEmployeeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
