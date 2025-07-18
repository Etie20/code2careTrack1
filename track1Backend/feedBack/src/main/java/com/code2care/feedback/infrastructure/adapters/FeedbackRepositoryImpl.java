package com.code2care.feedback.infrastructure.adapters;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.common.infrastructure.config.Mapper;
import com.code2care.common.infrastructure.entites.Feedback;
import com.code2care.feedback.domain.repository.FeedbackRepository;
import com.code2care.feedback.infrastructure.repository.JpaFeebackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FeedbackRepositoryImpl implements FeedbackRepository {
    private final JpaFeebackRepository jpaFeebackRepository;

    @Override
    public FeedbackDto save(FeedbackDto feedbackDto) {
        Feedback feedback = jpaFeebackRepository.save(Mapper.mapFeedback(feedbackDto));
        return Mapper.mapFeedbackDto(feedback);
    }

    @Override
    public Page<FeedbackDto> findAll(Pageable pageable) {
        return jpaFeebackRepository.findAll(pageable).map(Mapper::mapFeedbackDto);
    }

    @Override
    public List<FeedbackDto> findRecentFeedback() {
        return Mapper.mapFeedbackDtos(jpaFeebackRepository.findTop3ByOrderBySubmittedAtDesc());
    }
}
