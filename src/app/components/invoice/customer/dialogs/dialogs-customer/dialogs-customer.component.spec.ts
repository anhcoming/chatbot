import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsCustomerComponent } from './dialogs-customer.component';

describe('DialogsCustomerComponent', () => {
  let component: DialogsCustomerComponent;
  let fixture: ComponentFixture<DialogsCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogsCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogsCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
