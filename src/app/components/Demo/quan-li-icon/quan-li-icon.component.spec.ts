import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLiIconComponent } from './quan-li-icon.component';

describe('QuanLiIconComponent', () => {
  let component: QuanLiIconComponent;
  let fixture: ComponentFixture<QuanLiIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuanLiIconComponent]
    });
    fixture = TestBed.createComponent(QuanLiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
