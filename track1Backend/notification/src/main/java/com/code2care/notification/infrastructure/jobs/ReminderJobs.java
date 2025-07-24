package com.code2care.notification.infrastructure.jobs;

import com.code2care.common.domain.model.ChannelType;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class ReminderJobs {

    Resend resend = new Resend("re_Rwsf6NcQ_ABBLMU3aigoZvfDTpFRV2ADu");
    private final JpaReminderNotificationRepository jpaReminderNotificationRepository;

    @Value("${reminder.sid}")
    private String SID;
    @Value("${reminder.authToken}")
    private String TOKEN;
    public ReminderJobs(JpaReminderNotificationRepository jpaReminderNotificationRepository) {
        this.jpaReminderNotificationRepository = jpaReminderNotificationRepository;
    }

    // second, minute, hour, day, month, weekday
    @Scheduled(cron = "0 * * * * *")
    void   sendEmail(){
        List<Reminder> reminders = jpaReminderNotificationRepository.findRemindersForCurrentDateAndTime();
        Twilio.init(
                SID,
                TOKEN);
        for (Reminder reminder : reminders) {
            log.info("Sending reminder to patient {}: {}", reminder.getPatient().getEmail(), reminder.getMessage());
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev")
                    .to(reminder.getPatient().getEmail().value())
                    .subject("hospital reminder!")
                    .html("<strong>‍⚕️👩🏾‍⚕️"+reminder.getMessage()+"</strong>")
                    .build();
            try {
                if (reminder.getChannel() == ChannelType.SMS) {
                    Message.creator(
                                    new PhoneNumber(reminder.getPatient().getPhoneNumber()),
                                    new PhoneNumber("+18145511054"),
                                    "🧑🏾‍⚕️👩🏾‍⚕️"+reminder.getMessage())
                            .create();
                }else {
                    CreateEmailResponse data = resend.emails().send(params);
                    System.out.println(data.getId());
                }

            } catch (ResendException e) {
                e.printStackTrace();
            }
        }


        if (reminders.isEmpty()) {
            log.info("Aucun reminder à cette minute.");
        }
    }


}
