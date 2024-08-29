import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountStaffComponent } from './create-account-staff.component';

describe('CreateAccountStaffComponent', () => {
  let component: CreateAccountStaffComponent;
  let fixture: ComponentFixture<CreateAccountStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAccountStaffComponent]
    });
    fixture = TestBed.createComponent(CreateAccountStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
