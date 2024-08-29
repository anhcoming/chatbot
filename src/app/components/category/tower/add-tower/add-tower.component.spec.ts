import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTowerComponent } from './add-tower.component';

describe('AddTowerComponent', () => {
  let component: AddTowerComponent;
  let fixture: ComponentFixture<AddTowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTowerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
