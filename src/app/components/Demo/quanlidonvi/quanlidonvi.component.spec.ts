import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlidonviComponent } from './quanlidonvi.component';

describe('QuanlidonviComponent', () => {
  let component: QuanlidonviComponent;
  let fixture: ComponentFixture<QuanlidonviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanlidonviComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlidonviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
