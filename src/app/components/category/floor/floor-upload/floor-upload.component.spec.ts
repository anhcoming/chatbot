import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorUploadComponent } from './floor-upload.component';

describe('FloorUploadComponent', () => {
  let component: FloorUploadComponent;
  let fixture: ComponentFixture<FloorUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
