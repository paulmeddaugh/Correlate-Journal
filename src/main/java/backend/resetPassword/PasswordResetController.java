package backend.resetPassword;

import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import backend.security.SecurityService;
import backend.user.User;
import backend.user.UserService;

@RestController
public class PasswordResetController {
	
	private final UserService userService;
    private final MailService mailService;
    private final SecurityService securityService;
    
    @Value("${frontend.url}")
	private String frontendUrl;
	
	PasswordResetController(UserService userService, MailService mailService, 
			SecurityService securityService) {
		this.userService = userService;
		this.mailService = mailService;
		this.securityService = securityService;
	}
	
	@PostMapping("/api/user/resetPassword")
    public GenericResponse resetPassword(HttpServletRequest request, 
      @RequestParam("username") String username) {
    	
        User user = userService.findByUsername(username);
        
        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);
        
        String appUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        
        mailService.sendPasswordResetEmail(appUrl, request.getLocale(), token, user);
        return new GenericResponse("Reset password link sent.");
    }
	
//	@RequestMapping(value = "/redirect", method = RequestMethod.GET)
	@GetMapping("/user/changePassword")
	public void method(HttpServletResponse httpServletResponse, @RequestParam("token") String token) {
		
		String result = securityService.validatePasswordResetToken(token);
	    String redirectUrl = "";
	    if(result != null) {
//	        String message = messages.getMessage("auth.message." + result, null, locale);
	    	redirectUrl = frontendUrl;
		    
	    } else {
	        redirectUrl = frontendUrl + "/changePassword?token=" + token;
	    }
		
	    httpServletResponse.setHeader("Location", redirectUrl);
	    httpServletResponse.setStatus(302);
	}
	
	@PostMapping("/api/user/savePassword")
	public GenericResponse savePassword(final Locale locale, @RequestBody PasswordDto passwordDto) {
		
		String token = passwordDto.getToken();

	    String result = securityService.validatePasswordResetToken(token);

	    if (result != null) {
//	        return new GenericResponse(messages.getMessage(
//	            "auth.message." + result, null, locale));
	    	return new GenericResponse(null, "Password reset token is invalid.");
	    }

	    User user = userService.getUserByPasswordResetToken(token);
	    if (user != null) {
	        userService.changeUserPassword(user, passwordDto.getNewPassword());
//	        return new GenericResponse(messages.getMessage(
//	            "message.resetPasswordSuc", null, locale));
	        return new GenericResponse("Password updated.");
	    } else {
//	        return new GenericResponse(messages.getMessage(
//	            "auth.message.invalid", null, locale));
	    	return new GenericResponse(null, "User not found; password failed to save.");
	    }
	}
}
