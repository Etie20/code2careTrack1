package com.code2care.notification.infrastructure.jobs;

import com.code2care.common.domain.model.ChannelType;
import com.code2care.common.domain.model.ReminderStatus;
import com.code2care.common.infrastructure.entites.Reminder;
import com.code2care.notification.infrastructure.repository.JpaReminderNotificationRepository;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Slf4j
@Component
public class ReminderJobs {

    Resend resend = new Resend("re_Rwsf6NcQ_ABBLMU3aigoZvfDTpFRV2ADu");
    private final JpaReminderNotificationRepository jpaReminderNotificationRepository;

    @Value("${reminder.sid}")
    private String SID;
    @Value("${reminder.authToken}")
    private String TOKEN;
    private final AnthropicChatModel aiChatModel;
    public ReminderJobs(JpaReminderNotificationRepository jpaReminderNotificationRepository, AnthropicChatModel aiChatModel) {
        this.jpaReminderNotificationRepository = jpaReminderNotificationRepository;
        this.aiChatModel = aiChatModel;

//                MistralAiChatModel.builder()
//                        .mistralAiApi(new MistralAiApi(this.mistralAiApi))
//                .defaultOptions(MistralAiChatOptions.builder()
//                        .model(MistralAiApi.ChatModel.LARGE.getValue())
//                        .temperature(0.4)
//                        .maxTokens(200)
//                        .build())
//                .build();
    }

    // second, minute, hour, day, month, weekday
    @Scheduled(cron = "0 * * * * *")
    void   sendEmail(){
        ZonedDateTime nowInGmtPlus1 = ZonedDateTime.now(ZoneId.of("Africa/Douala"));
        String hourMinute = nowInGmtPlus1.format(DateTimeFormatter.ofPattern("HH:mm"));
        LocalDate todayInGmtPlus1 = nowInGmtPlus1.toLocalDate();
        System.out.println("hourMinute: " + hourMinute+" day: "+todayInGmtPlus1.toString());
        List<Reminder> reminders = jpaReminderNotificationRepository.findRemindersByDateAndTime(todayInGmtPlus1,hourMinute);

        Twilio.init(
                SID,
                TOKEN);
        for (Reminder reminder : reminders) {
            log.info("Sending reminder to patient {}: {}", reminder.getPatient().getEmail(), reminder.getMessage());

            try {
                    ChatResponse response = aiChatModel.call(
                            new Prompt(
                                    "Traduis uniquement le texte ci-dessous en dialecte camerounais " + reminder.getPatient().getPreferredLanguage() + ". " +
                                            "Si un mot n'existe pas dans ce dialecte, laisse-le tel quel (en français ou anglais). " +
                                            "Renvoie uniquement le texte traduit, sans explication ni commentaire. " +
                                            "Voici le texte : " + reminder.getMessage()));
                String  message = Objects.requireNonNull(response.getResult().getOutput().getText());

                if (reminder.getChannel() == ChannelType.sms) {
                    Message.creator(
                                    new PhoneNumber(reminder.getPatient().getPhoneNumber()),
                                    new PhoneNumber("+18145511054"),
                                    "🧑🏾‍⚕️👩🏾‍⚕️"+message)
                            .create();
                }else {
                    CreateEmailOptions params = CreateEmailOptions.builder()
                            .from("onboarding@resend.dev")
                            .to(reminder.getPatient().getEmail().value())
                            .subject("hospital reminder!")
                            .html("<strong>‍⚕️👩🏾‍⚕️"+message+"</strong>")
                            .build();
                    CreateEmailResponse data = resend.emails().send(params);
                    System.out.println(data.getId());
                }
                jpaReminderNotificationRepository.updateStatusById(ReminderStatus.DELIVERED,reminder.getId());

            } catch (ResendException e) {
                e.printStackTrace();
            }
        }


        if (reminders.isEmpty()) {
            log.info("Aucun reminder à cette minute.");
        }
    }


}
