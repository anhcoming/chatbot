import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailConfigComponent } from './add-email-config.component';

describe('AddEmailConfigComponent', () => {
  let component: AddEmailConfigComponent;
  let fixture: ComponentFixture<AddEmailConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmailConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmailConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
