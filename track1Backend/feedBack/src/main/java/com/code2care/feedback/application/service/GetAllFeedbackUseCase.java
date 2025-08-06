package com.code2care.feedback.application.service;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.feedback.domain.service.FeedbackDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllFeedbackUseCase {
    private final FeedbackDomainService feedbackDomainService;

    public List<FeedbackDto> execute() {
        return feedbackDomainService.findAllFeedback();
    }
}
