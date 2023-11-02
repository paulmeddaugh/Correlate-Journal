package backend.resetPassword;

import java.util.Locale;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import backend.user.User;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;
    
    public void send(SimpleMailMessage message) {
    	try {
			javaMailSender.send(message);
		} catch (Exception e) {
			e.printStackTrace();
		}
    }

    public void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        this.send(
        	constructEmail(to, subject, body)
        );
    }
    
    public void sendPasswordResetEmail(String contextPath, Locale locale, String token, User user) {
    	
    	//	String message = messages.getMessage("message.resetPassword", null, locale);
    	String url = contextPath + "/user/changePassword?token=" + token;
    	String message = "If you would like to reset your password, please go to the link below:"
    		 + " \r\n" + url + " \r\n \r\n Sincerely,\r\n The ThoughtWeb Team";
    	
    	this.send(
    		constructEmail(user.getEmail(), "Reset Password", message)
    	);
    }

	private static SimpleMailMessage constructEmail(String to, String subject, String body) {
	    SimpleMailMessage email = new SimpleMailMessage();
	    email.setSubject(subject);
	    email.setText(body);
	    email.setTo(to);
	    email.setFrom("paul.meddaugh@gmail.com"); // support email
	    return email;
	}

}