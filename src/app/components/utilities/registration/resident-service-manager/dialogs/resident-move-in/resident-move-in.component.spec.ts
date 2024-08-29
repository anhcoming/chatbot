import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentMoveInComponent } from './resident-move-in.component';

describe('ResidentMoveInComponent', () => {
  let component: ResidentMoveInComponent;
  let fixture: ComponentFixture<ResidentMoveInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentMoveInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentMoveInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
