import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyquestionComponent } from './dailyquestion.component';

describe('DailyquestionComponent', () => {
  let component: DailyquestionComponent;
  let fixture: ComponentFixture<DailyquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyquestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
