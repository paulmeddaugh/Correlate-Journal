package backend.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import backend.oauth2.OAuth2LoginSuccessHandler;
import backend.user.CustomUserDetailsService;
import backend.user.FormLoginSuccessHandler;

//import backend.user.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
//@ImportResource({ "classpath:webSecurityConfig.xml" })
public class SecSecurityConfig {
	
	@Autowired
	private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
	
	@Autowired
	private FormLoginSuccessHandler formLoginSuccessHandler;
	
	@Value("${frontend.url}")
	private String frontendUrl;
	
	private final CustomUserDetailsService customUserDetailsService;
	
	SecSecurityConfig (CustomUserDetailsService customUserDetailsService) {
		this.customUserDetailsService = customUserDetailsService;
	}
	
    @Bean
    public SecurityFilterChain securityfilterChain(HttpSecurity http) throws Exception {
        // http builder configurations for authorize requests and form login (see below)
    	return http
    		.csrf(AbstractHttpConfigurer::disable)
    		.cors(cors ->
    			cors.configurationSource(corsConfigurationSource())
    		)
    		.authorizeRequests(a -> a
    			.antMatchers("/", "/static/**", "/**/favicon.png", "/favicon192.png", "/manifest.json",
    					"/createAccount", "/forgotPassword", "/changePassword",
    					"/userValidate", "/api/users/newUser", "/login*", "/error", 
    					"/user/changePassword*", "/api/user/resetPassword", "/api/user/savePassword")
    				.permitAll()
              	.anyRequest().authenticated()
    		)
    		.oauth2Login(oath2 -> oath2
    			.successHandler(oAuth2LoginSuccessHandler)
    			.failureUrl(frontendUrl + "?message=oauth2error")
    		)
    		.formLogin(login -> login
    			.loginProcessingUrl("/userValidate")
    			.successHandler(formLoginSuccessHandler)
    			.failureUrl(frontendUrl + "message=formerror")
    		)
    		.exceptionHandling(e -> e
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
    		.logout(l -> l
    			.logoutSuccessUrl("/").permitAll()
    		)
    		.build();
    }
    
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
    	CorsConfiguration configuration = new CorsConfiguration();
    	configuration.setAllowedOrigins(List.of(frontendUrl));
    	configuration.addAllowedHeader("*");
    	configuration.addAllowedMethod("*");
    	configuration.setAllowCredentials(true);
    	
    	UrlBasedCorsConfigurationSource urlBasedCorsConfig = new UrlBasedCorsConfigurationSource();
    	urlBasedCorsConfig.registerCorsConfiguration("/**", configuration);
    	
    	return urlBasedCorsConfig;
    }
    
    @Bean
	public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(customUserDetailsService);
        return provider;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}