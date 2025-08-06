package com.code2care.feedback.domain.repository;

import com.code2care.common.domain.model.FeedbackDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeedbackRepository {
    FeedbackDto save(FeedbackDto feedbackDto);
    List<FeedbackDto> findAll();
    List<FeedbackDto> findRecentFeedback();
}
