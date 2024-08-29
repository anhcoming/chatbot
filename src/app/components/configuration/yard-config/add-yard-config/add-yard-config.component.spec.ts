import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYardConfigComponent } from './add-yard-config.component';

describe('AddYardConfigComponent', () => {
  let component: AddYardConfigComponent;
  let fixture: ComponentFixture<AddYardConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddYardConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddYardConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
