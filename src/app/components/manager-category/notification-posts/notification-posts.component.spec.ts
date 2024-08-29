import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPostsComponent } from './notification-posts.component';

describe('NotificationPostsComponent', () => {
  let component: NotificationPostsComponent;
  let fixture: ComponentFixture<NotificationPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationPostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
