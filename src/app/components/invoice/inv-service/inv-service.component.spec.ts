import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvServiceComponent } from './inv-service.component';

describe('InvServiceComponent', () => {
  let component: InvServiceComponent;
  let fixture: ComponentFixture<InvServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
