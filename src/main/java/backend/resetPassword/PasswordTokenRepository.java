package backend.resetPassword;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Long> {
	PasswordResetToken findByToken(String token);
}