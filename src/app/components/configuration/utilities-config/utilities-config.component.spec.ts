import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesConfigComponent } from './utilities-config.component';

describe('UtilitiesConfigComponent', () => {
  let component: UtilitiesConfigComponent;
  let fixture: ComponentFixture<UtilitiesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilitiesConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilitiesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
