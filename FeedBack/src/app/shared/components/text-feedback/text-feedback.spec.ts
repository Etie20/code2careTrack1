import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFeedback } from './text-feedback';

describe('TextFeedback', () => {
  let component: TextFeedback;
  let fixture: ComponentFixture<TextFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
