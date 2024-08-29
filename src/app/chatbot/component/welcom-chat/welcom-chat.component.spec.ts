import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomChatComponent } from './welcom-chat.component';

describe('WelcomChatComponent', () => {
  let component: WelcomChatComponent;
  let fixture: ComponentFixture<WelcomChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomChatComponent]
    });
    fixture = TestBed.createComponent(WelcomChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
