import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIconsTopicComponent } from './create-icons-topic.component';

describe('CreateIconsTopicComponent', () => {
  let component: CreateIconsTopicComponent;
  let fixture: ComponentFixture<CreateIconsTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIconsTopicComponent]
    });
    fixture = TestBed.createComponent(CreateIconsTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
