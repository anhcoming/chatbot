import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerUploadComponent } from './tower-upload.component';

describe('TowerUploadComponent', () => {
  let component: TowerUploadComponent;
  let fixture: ComponentFixture<TowerUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowerUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
