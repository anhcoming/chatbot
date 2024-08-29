import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferGoodComponent } from './transfer-good.component';

describe('TransferGoodComponent', () => {
  let component: TransferGoodComponent;
  let fixture: ComponentFixture<TransferGoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferGoodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferGoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
