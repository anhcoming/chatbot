import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvServiceGroupComponent } from './add-inv-service-group.component';

describe('AddInvServiceGroupComponent', () => {
  let component: AddInvServiceGroupComponent;
  let fixture: ComponentFixture<AddInvServiceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvServiceGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInvServiceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
