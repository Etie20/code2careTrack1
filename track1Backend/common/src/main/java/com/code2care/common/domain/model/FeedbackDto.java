package com.code2care.common.domain.model;

import lombok.Builder;
import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.code2care.common.infrastructure.entites.Feedback}
 */
@Value
@Builder
public class FeedbackDto implements Serializable {
    Integer id;
    PatientDto patient;
    String feedbackText;
    String feedbackAudioUrl;
    Integer waitTimeMin;
    Integer resolutionTimeMin;
    String emojiRating;
    Integer starRating;
    Instant submittedAt;
    Language language;
}