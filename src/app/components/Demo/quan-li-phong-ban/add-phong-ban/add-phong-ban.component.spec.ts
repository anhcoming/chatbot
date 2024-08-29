import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhongBanComponent } from './add-phong-ban.component';

describe('AddPhongBanComponent', () => {
  let component: AddPhongBanComponent;
  let fixture: ComponentFixture<AddPhongBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPhongBanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhongBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
