package backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.resetPassword.PasswordResetToken;
import backend.resetPassword.PasswordTokenRepository;

@Service
public class SecurityService {
	
	@Autowired
	private PasswordTokenRepository passwordTokenRepository;
	
	public String validatePasswordResetToken(String token) {
        final PasswordResetToken passToken = passwordTokenRepository.findByToken(token);

        return (passToken == null) ? "invalidToken"
                : PasswordResetToken.isTokenExpired(passToken) ? "expired"
                : null;
    }
}
