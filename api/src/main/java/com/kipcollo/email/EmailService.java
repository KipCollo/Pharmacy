package com.kipcollo.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

   private final JavaMailSender mailSender;
   private final SpringTemplateEngine templateEngine;

   @Async
   public void send(String to, String userName, EmailTemplate emailTemplate, String confirmUrl, String activationCode, String subject)throws MessagingException {
       String templateName;
       if (emailTemplate == null) {
           templateName = "confirm-email";
       } else {
           templateName = emailTemplate.name();
       }

       MimeMessage message = mailSender.createMimeMessage();
       MimeMessageHelper helper = new MimeMessageHelper(message,MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
       Map<String, Object> properties = new HashMap<>();
       properties.put("username", userName);
       properties.put("confirmation", confirmUrl);
       properties.put("activationCode", activationCode);

       Context context = new Context();
       context.setVariables(properties);

       helper.setFrom("contact@collinskipkosgei.com");
       helper.setTo(to);
       helper.setSubject(subject);

       String template = templateEngine.process(templateName, context);

       helper.setText(template, true);

       mailSender.send(message);
   }
}
