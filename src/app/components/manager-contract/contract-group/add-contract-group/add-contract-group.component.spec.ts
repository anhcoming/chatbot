import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractGroupComponent } from './add-contract-group.component';

describe('AddContractGroupComponent', () => {
  let component: AddContractGroupComponent;
  let fixture: ComponentFixture<AddContractGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContractGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
