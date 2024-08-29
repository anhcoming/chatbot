import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarChatbotComponent } from './topbar-chatbot.component';

describe('TopbarChatbotComponent', () => {
  let component: TopbarChatbotComponent;
  let fixture: ComponentFixture<TopbarChatbotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopbarChatbotComponent]
    });
    fixture = TestBed.createComponent(TopbarChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
