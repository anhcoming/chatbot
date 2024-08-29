import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookCategoryComponent } from './notebook-category.component';

describe('NotebookCategoryComponent', () => {
  let component: NotebookCategoryComponent;
  let fixture: ComponentFixture<NotebookCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotebookCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebookCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
