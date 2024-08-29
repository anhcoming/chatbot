import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvServiceConfigComponent } from './inv-service-config.component';

describe('InvServiceConfigComponent', () => {
  let component: InvServiceConfigComponent;
  let fixture: ComponentFixture<InvServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
