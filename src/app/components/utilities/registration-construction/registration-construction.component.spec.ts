import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationConstructionComponent } from './registration-construction.component';

describe('RegistrationConstructionComponent', () => {
  let component: RegistrationConstructionComponent;
  let fixture: ComponentFixture<RegistrationConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationConstructionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
