import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionExtendComponent } from './construction-extend.component';

describe('ConstructionExtendComponent', () => {
  let component: ConstructionExtendComponent;
  let fixture: ComponentFixture<ConstructionExtendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionExtendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructionExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
