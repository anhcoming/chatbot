import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFunctionRoleComponent } from './add-function-role.component';

describe('AddFunctionRoleComponent', () => {
  let component: AddFunctionRoleComponent;
  let fixture: ComponentFixture<AddFunctionRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFunctionRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFunctionRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
