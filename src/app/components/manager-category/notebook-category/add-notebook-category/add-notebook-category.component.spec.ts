import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotebookCategoryComponent } from './add-notebook-category.component';

describe('AddNotebookCategoryComponent', () => {
  let component: AddNotebookCategoryComponent;
  let fixture: ComponentFixture<AddNotebookCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotebookCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNotebookCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
