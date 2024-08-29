import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUnlockComponent } from './card-unlock.component';

describe('CardUnlockComponent', () => {
  let component: CardUnlockComponent;
  let fixture: ComponentFixture<CardUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardUnlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
