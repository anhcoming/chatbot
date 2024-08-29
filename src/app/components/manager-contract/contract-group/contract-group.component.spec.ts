import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractGroupComponent } from './contract-group.component';

describe('ContractGroupComponent', () => {
  let component: ContractGroupComponent;
  let fixture: ComponentFixture<ContractGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
