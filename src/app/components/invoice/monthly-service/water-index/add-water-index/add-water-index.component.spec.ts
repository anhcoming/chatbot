import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaterIndexComponent } from './add-water-index.component';

describe('AddWaterIndexComponent', () => {
  let component: AddWaterIndexComponent;
  let fixture: ComponentFixture<AddWaterIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaterIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWaterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
