import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLiPhongBanComponent } from './quan-li-phong-ban.component';

describe('QuanLiPhongBanComponent', () => {
  let component: QuanLiPhongBanComponent;
  let fixture: ComponentFixture<QuanLiPhongBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLiPhongBanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLiPhongBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
