import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUtilitiesServiceComponent } from './add-utilities-service.component';

describe('AddUtilitiesServiceComponent', () => {
  let component: AddUtilitiesServiceComponent;
  let fixture: ComponentFixture<AddUtilitiesServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUtilitiesServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUtilitiesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
