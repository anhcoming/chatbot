import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYardDialogComponent } from './add-yard-dialog.component';

describe('AddYardDialogComponent', () => {
  let component: AddYardDialogComponent;
  let fixture: ComponentFixture<AddYardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddYardDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddYardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
