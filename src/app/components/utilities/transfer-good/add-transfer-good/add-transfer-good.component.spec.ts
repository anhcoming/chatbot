import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferGoodComponent } from './add-transfer-good.component';

describe('AddTransferGoodComponent', () => {
  let component: AddTransferGoodComponent;
  let fixture: ComponentFixture<AddTransferGoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransferGoodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransferGoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
