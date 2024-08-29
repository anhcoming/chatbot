import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarChatbotComponent } from './sidebar-chatbot.component';

describe('SidebarChatbotComponent', () => {
  let component: SidebarChatbotComponent;
  let fixture: ComponentFixture<SidebarChatbotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarChatbotComponent]
    });
    fixture = TestBed.createComponent(SidebarChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
