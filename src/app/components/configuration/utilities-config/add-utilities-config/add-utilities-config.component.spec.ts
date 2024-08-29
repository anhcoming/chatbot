import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUtilitiesConfigComponent } from './add-utilities-config.component';

describe('AddUtilitiesConfigComponent', () => {
  let component: AddUtilitiesConfigComponent;
  let fixture: ComponentFixture<AddUtilitiesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUtilitiesConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUtilitiesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
