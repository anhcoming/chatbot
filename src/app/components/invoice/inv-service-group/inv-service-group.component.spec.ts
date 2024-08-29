import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvServiceGroupComponent } from './inv-service-group.component';

describe('InvServiceGroupComponent', () => {
  let component: InvServiceGroupComponent;
  let fixture: ComponentFixture<InvServiceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvServiceGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvServiceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
