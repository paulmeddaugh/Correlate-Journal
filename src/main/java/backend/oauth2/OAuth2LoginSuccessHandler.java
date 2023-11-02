package backend.oauth2;

import java.io.IOException;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import backend.user.User;
import backend.user.UserAlreadyExistsException;
import backend.user.UserRepository;
import backend.user.UserService;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	@Value("${frontend.url}")
	private String frontendUrl;
	
	private final UserRepository userRepository;
	
	OAuth2LoginSuccessHandler(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {
		this.setAlwaysUseDefaultTargetUrl(true);
		this.setDefaultTargetUrl(frontendUrl + "?usingOauth=true");
		
		// Creates a new user if not existing
		DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
		
		if (userRepository.findByUsernameIgnoreCase(oauthUser.getAttribute("email")).isEmpty()) {
    		userRepository.save(User.fromDefaultOAuth2User(oauthUser));
    	}
		
//		this.clearAuthenticationAttributes(request);
//        this.getRedirectStrategy().sendRedirect(request, response, "/user");
		super.onAuthenticationSuccess(request, response, authentication);
	}
}
