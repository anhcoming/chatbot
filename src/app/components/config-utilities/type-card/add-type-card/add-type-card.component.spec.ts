import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeCardComponent } from './add-type-card.component';

describe('AddTypeCardComponent', () => {
  let component: AddTypeCardComponent;
  let fixture: ComponentFixture<AddTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
