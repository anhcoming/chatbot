import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeAttributeComponent } from './add-type-attribute.component';

describe('AddTypeAttributeComponent', () => {
  let component: AddTypeAttributeComponent;
  let fixture: ComponentFixture<AddTypeAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeAttributeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
