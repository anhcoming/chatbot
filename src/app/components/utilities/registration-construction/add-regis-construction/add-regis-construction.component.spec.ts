import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegisConstructionComponent } from './add-regis-construction.component';

describe('AddRegisConstructionComponent', () => {
  let component: AddRegisConstructionComponent;
  let fixture: ComponentFixture<AddRegisConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegisConstructionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRegisConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
