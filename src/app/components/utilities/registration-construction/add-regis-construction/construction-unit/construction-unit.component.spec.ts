import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionUnitComponent } from './construction-unit.component';

describe('ConstructionUnitComponent', () => {
  let component: ConstructionUnitComponent;
  let fixture: ComponentFixture<ConstructionUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructionUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
