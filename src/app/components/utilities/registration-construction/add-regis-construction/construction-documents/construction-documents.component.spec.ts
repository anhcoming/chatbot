import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionDocumentsComponent } from './construction-documents.component';

describe('ConstructionDocumentsComponent', () => {
  let component: ConstructionDocumentsComponent;
  let fixture: ComponentFixture<ConstructionDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructionDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
