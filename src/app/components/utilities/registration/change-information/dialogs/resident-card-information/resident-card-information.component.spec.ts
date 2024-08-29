import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentCardInformationComponent } from './resident-card-information.component';

describe('ResidentCardInformationComponent', () => {
  let component: ResidentCardInformationComponent;
  let fixture: ComponentFixture<ResidentCardInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidentCardInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentCardInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
