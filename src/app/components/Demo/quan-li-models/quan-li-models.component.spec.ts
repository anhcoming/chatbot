import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLiModelsComponent } from './quan-li-models.component';

describe('QuanLiModelsComponent', () => {
  let component: QuanLiModelsComponent;
  let fixture: ComponentFixture<QuanLiModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLiModelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanLiModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
