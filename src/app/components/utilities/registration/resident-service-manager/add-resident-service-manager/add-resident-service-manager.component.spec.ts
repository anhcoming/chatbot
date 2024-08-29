import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResidentServiceManagerComponent } from './add-resident-service-manager.component';

describe('AddResidentServiceManagerComponent', () => {
  let component: AddResidentServiceManagerComponent;
  let fixture: ComponentFixture<AddResidentServiceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResidentServiceManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResidentServiceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
