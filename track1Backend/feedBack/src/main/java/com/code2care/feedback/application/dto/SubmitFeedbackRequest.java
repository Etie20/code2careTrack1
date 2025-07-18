package com.code2care.feedback.application.dto;

import com.code2care.common.domain.model.Language;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SubmitFeedbackRequest {
    Integer patientId;
    String feedbackText;
    String feedbackAudioUrl;
    String emojiRating;
    Integer starRating;
    Instant submittedAt;
    Language language;
}
