import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeebackSummaryCard } from './feeback-summary-card';

describe('FeebackSummaryCard', () => {
  let component: FeebackSummaryCard;
  let fixture: ComponentFixture<FeebackSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeebackSummaryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeebackSummaryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
