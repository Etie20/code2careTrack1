import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSummaryCard } from './feedback-summary-card';

describe('FeedbackSummaryCard', () => {
  let component: FeedbackSummaryCard;
  let fixture: ComponentFixture<FeedbackSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
