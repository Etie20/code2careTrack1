package com.code2care.feedback.application.service;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.feedback.application.dto.SubmitFeedbackRequest;
import com.code2care.feedback.domain.service.FeedbackDomainService;
import com.code2care.feedback.infrastructure.config.FeedbackMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmitFeedbackUseCase {
    private final FeedbackDomainService feedbackDomainService;
    public void execute(SubmitFeedbackRequest submitFeedbackRequest) {
        FeedbackDto feedbackDto = FeedbackMapper.mapFeedbackDto(submitFeedbackRequest);
        feedbackDomainService.saveFeedback(feedbackDto);
    }
}
