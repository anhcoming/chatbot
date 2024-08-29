import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuanLiDonViComponent } from './add-quan-li-don-vi.component';

describe('AddQuanLiDonViComponent', () => {
  let component: AddQuanLiDonViComponent;
  let fixture: ComponentFixture<AddQuanLiDonViComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuanLiDonViComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQuanLiDonViComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
