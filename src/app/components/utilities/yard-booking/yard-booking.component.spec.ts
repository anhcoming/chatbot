import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YardBookingComponent } from './yard-booking.component';

describe('YardBookingComponent', () => {
  let component: YardBookingComponent;
  let fixture: ComponentFixture<YardBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YardBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YardBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
