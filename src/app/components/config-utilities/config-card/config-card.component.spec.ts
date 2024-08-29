import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCardComponent } from './config-card.component';

describe('ConfigCardComponent', () => {
  let component: ConfigCardComponent;
  let fixture: ComponentFixture<ConfigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
