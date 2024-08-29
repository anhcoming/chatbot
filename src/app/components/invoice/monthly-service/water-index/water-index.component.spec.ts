import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterIndexComponent } from './water-index.component';

describe('WaterIndexComponent', () => {
  let component: WaterIndexComponent;
  let fixture: ComponentFixture<WaterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
