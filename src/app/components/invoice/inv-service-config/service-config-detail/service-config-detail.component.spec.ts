import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigDetailComponent } from './service-config-detail.component';

describe('ServiceConfigDetailComponent', () => {
  let component: ServiceConfigDetailComponent;
  let fixture: ComponentFixture<ServiceConfigDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceConfigDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceConfigDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
