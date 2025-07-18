package com.code2care.common.infrastructure.entites;


import com.code2care.common.domain.model.Language;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Table(name = "feedback")
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    @org.hibernate.annotations.ColumnDefault("nextval('feedback_id_seq')")
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "feedback_text", length = Integer.MAX_VALUE)
    private String feedbackText;

    @Column(name = "feedback_audio_url", length = Integer.MAX_VALUE)
    private String feedbackAudioUrl;

    @Column(name = "wait_time_min")
    private Integer waitTimeMin;

    @Column(name = "resolution_time_min")
    private Integer resolutionTimeMin;

    @Column(name = "emoji_rating", length = 10)
    private String emojiRating;

    @Column(name = "star_rating")
    private Integer starRating;

    @org.hibernate.annotations.ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "submitted_at")
    private Instant submittedAt;


    @org.hibernate.annotations.ColumnDefault("'FR'")
    @Column(name = "language", columnDefinition = "language_enum",nullable = false)
    @Enumerated(EnumType.STRING)
    private Language language;
}

