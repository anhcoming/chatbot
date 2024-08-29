import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCancelComponent } from './card-cancel.component';

describe('CardCancelComponent', () => {
  let component: CardCancelComponent;
  let fixture: ComponentFixture<CardCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
