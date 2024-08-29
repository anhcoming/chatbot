import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionRoleComponent } from './function-role.component';

describe('FunctionRoleComponent', () => {
  let component: FunctionRoleComponent;
  let fixture: ComponentFixture<FunctionRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunctionRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
