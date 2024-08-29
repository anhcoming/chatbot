import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderAcceptanceComponent } from './add-order-acceptance.component';

describe('AddOrderAcceptanceComponent', () => {
  let component: AddOrderAcceptanceComponent;
  let fixture: ComponentFixture<AddOrderAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrderAcceptanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrderAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
