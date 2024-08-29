import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvServiceComponent } from './add-inv-service.component';

describe('AddInvServiceComponent', () => {
  let component: AddInvServiceComponent;
  let fixture: ComponentFixture<AddInvServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
