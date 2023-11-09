package backend.login;

import java.util.List;

import javax.persistence.NonUniqueResultException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.user.User;
import backend.user.UserNotFoundException;
import backend.user.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
    	
    	User userFound = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(username, username)
	    	.orElseThrow(() -> new UserNotFoundException(username));

        return new CustomUserDetails(userFound);
    }
    
//    private List<GrantedAuthority> getAuthority(String role) {
//        return Collections.singletonList(new SimpleGrantedAuthority(role));
//    }
}
