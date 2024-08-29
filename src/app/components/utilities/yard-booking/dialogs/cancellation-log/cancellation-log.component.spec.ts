import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationLogComponent } from './cancellation-log.component';

describe('CancellationLogComponent', () => {
  let component: CancellationLogComponent;
  let fixture: ComponentFixture<CancellationLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancellationLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
