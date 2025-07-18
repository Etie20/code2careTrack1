package com.code2care.feedback.domain.repository;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.feedback.application.dto.SubmitFeedbackRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeedbackRepository {
    FeedbackDto save(FeedbackDto feedbackDto);
    Page<FeedbackDto> findAll(Pageable pageable);
    List<FeedbackDto> findRecentFeedback();
}
