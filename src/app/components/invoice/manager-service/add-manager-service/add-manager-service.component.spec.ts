import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagerServiceComponent } from './add-manager-service.component';

describe('AddManagerServiceComponent', () => {
  let component: AddManagerServiceComponent;
  let fixture: ComponentFixture<AddManagerServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManagerServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManagerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
