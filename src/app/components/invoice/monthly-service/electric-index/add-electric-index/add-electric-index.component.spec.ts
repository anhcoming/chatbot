import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddElectricIndexComponent } from './add-electric-index.component';

describe('AddElectricIndexComponent', () => {
  let component: AddElectricIndexComponent;
  let fixture: ComponentFixture<AddElectricIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddElectricIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddElectricIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
