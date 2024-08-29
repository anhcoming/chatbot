import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvServiceConfigComponent } from './add-inv-service-config.component';

describe('AddInvServiceConfigComponent', () => {
  let component: AddInvServiceConfigComponent;
  let fixture: ComponentFixture<AddInvServiceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvServiceConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInvServiceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
