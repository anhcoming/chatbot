import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesServiceComponent } from './utilities-service.component';

describe('UtilitiesServiceComponent', () => {
  let component: UtilitiesServiceComponent;
  let fixture: ComponentFixture<UtilitiesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilitiesServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilitiesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
