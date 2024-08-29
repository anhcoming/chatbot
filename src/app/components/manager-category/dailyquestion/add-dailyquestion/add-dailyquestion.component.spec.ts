import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyquestionComponent } from './add-dailyquestion.component';

describe('AddDailyquestionComponent', () => {
  let component: AddDailyquestionComponent;
  let fixture: ComponentFixture<AddDailyquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDailyquestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDailyquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
