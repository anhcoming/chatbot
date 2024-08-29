import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailResidentComponent } from './detail-resident.component';

describe('DetailResidentComponent', () => {
  let component: DetailResidentComponent;
  let fixture: ComponentFixture<DetailResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailResidentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
