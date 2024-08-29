import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricIndexComponent } from './electric-index.component';

describe('ElectricIndexComponent', () => {
  let component: ElectricIndexComponent;
  let fixture: ComponentFixture<ElectricIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
