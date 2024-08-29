import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardEmptyComponent } from './add-card-empty.component';

describe('AddCardEmptyComponent', () => {
  let component: AddCardEmptyComponent;
  let fixture: ComponentFixture<AddCardEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCardEmptyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCardEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
