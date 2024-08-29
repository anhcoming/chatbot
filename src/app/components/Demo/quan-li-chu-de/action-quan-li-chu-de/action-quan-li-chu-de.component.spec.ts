import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionQuanLiChuDeComponent } from './action-quan-li-chu-de.component';

describe('ActionQuanLiChuDeComponent', () => {
  let component: ActionQuanLiChuDeComponent;
  let fixture: ComponentFixture<ActionQuanLiChuDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionQuanLiChuDeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionQuanLiChuDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
