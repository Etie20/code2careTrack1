package com.code2care.feedback.infrastructure.controller;

import com.code2care.common.domain.model.FeedbackDto;
import com.code2care.feedback.application.dto.PageResponse;
import com.code2care.feedback.application.dto.SubmitFeedbackRequest;
import com.code2care.feedback.application.service.GetAllFeedbackUseCase;
import com.code2care.feedback.application.service.GetTop3FeedbackUseCase;
import com.code2care.feedback.application.service.SubmitFeedbackUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FeedbackController {
    private final GetAllFeedbackUseCase getAllFeedbackUseCase;
    private final SubmitFeedbackUseCase submitFeedbackUseCase;
    private final GetTop3FeedbackUseCase getTop3FeedbackUseCase;

    @GetMapping
    public ResponseEntity<List<FeedbackDto>> getAllFeedback() {
        try {
            return ResponseEntity.ok(getAllFeedbackUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<FeedbackDto> submitFeedback(@RequestBody SubmitFeedbackRequest submitFeedbackRequest) {
        submitFeedbackUseCase.execute(submitFeedbackRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/top3")
    public ResponseEntity<List<FeedbackDto>> getTop3Feedback() {
        return ResponseEntity.ok(getTop3FeedbackUseCase.execute());
    }

}
