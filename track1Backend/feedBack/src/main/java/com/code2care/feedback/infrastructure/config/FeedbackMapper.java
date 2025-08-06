package com.code2care.feedback.infrastructure.config;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.feedback.application.dto.SubmitFeedbackRequest;

import java.time.Instant;

public class FeedbackMapper {
    public static FeedbackDto mapFeedbackDto(SubmitFeedbackRequest request) {
        return FeedbackDto.builder()
                .patient(request.getPatient())
                .feedbackText(request.getFeedbackText())
                .feedbackAudioUrl(request.getFeedbackAudioUrl())
                .emojiRating(request.getEmojiRating())
                .starRating(request.getStarRating())
                .language(request.getLanguage())
                .submittedAt(Instant.now())
                .build();
    }
}
