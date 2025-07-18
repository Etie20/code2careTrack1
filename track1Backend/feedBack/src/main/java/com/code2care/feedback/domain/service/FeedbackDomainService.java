package com.code2care.feedback.domain.service;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.feedback.application.dto.SubmitFeedbackRequest;
import com.code2care.feedback.domain.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackDomainService {
    private final FeedbackRepository feedbackRepository;

    public FeedbackDto saveFeedback(FeedbackDto feedbackDto) {
        return feedbackRepository.save(feedbackDto);
    }

    public Page<FeedbackDto> findAllFeedback(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }

    public List<FeedbackDto> findRecentFeedback() {
        return feedbackRepository.findRecentFeedback();
    }
}
