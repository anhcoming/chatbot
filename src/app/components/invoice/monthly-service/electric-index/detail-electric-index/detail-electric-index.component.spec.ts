import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailElectricIndexComponent } from './detail-electric-index.component';

describe('DetailElectricIndexComponent', () => {
  let component: DetailElectricIndexComponent;
  let fixture: ComponentFixture<DetailElectricIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailElectricIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailElectricIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
