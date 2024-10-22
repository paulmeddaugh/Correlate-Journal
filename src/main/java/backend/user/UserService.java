package backend.user;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.resetPassword.PasswordResetToken;
import backend.resetPassword.PasswordTokenRepository;

@Service
public class UserService {
	
	private final UserRepository userRepository;
	private final PasswordTokenRepository passwordTokenRepository;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
	UserService(UserRepository userRepository, PasswordTokenRepository passwordTokenRepository) {
        this.userRepository = userRepository;
        this.passwordTokenRepository = passwordTokenRepository;
	}
	
	public User saveNewUser (User newUser) {
		
		if (userRepository.findByUsernameIgnoreCase(newUser.getUsername()).isEmpty()) {
    		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
    		return userRepository.save(newUser);
    	} else {
    		throw new UserAlreadyExistsException(newUser.getUsername());
    	}
		
	}
	
	public User findByEmail(String email) {
		return userRepository.findTopByEmailIgnoreCase(email)
				.orElseThrow(() -> new UserNotFoundException());
	}
	
	public User findByUsername(String username) {
		return userRepository.findByUsernameIgnoreCase(username)
        		.orElseThrow(() -> new UserNotFoundException());
	}
	
	public void createPasswordResetTokenForUser(User user, String token) {
	    PasswordResetToken myToken = new PasswordResetToken(token, user);
	    passwordTokenRepository.save(myToken);
	}
	
	public User getUserByPasswordResetToken(String token) {
		PasswordResetToken myToken = passwordTokenRepository.findByToken(token);
		return myToken != null ? myToken.getUser() : null;
	}
	
	public void changeUserPassword(User user, String password) {
	    user.setPassword(passwordEncoder.encode(password));
	    userRepository.save(user);
	}
	
}
