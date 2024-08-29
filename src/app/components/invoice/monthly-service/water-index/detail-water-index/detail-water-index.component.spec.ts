import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailWaterIndexComponent } from './detail-water-index.component';

describe('DetailWaterIndexComponent', () => {
  let component: DetailWaterIndexComponent;
  let fixture: ComponentFixture<DetailWaterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailWaterIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailWaterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
