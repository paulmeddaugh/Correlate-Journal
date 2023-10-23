package backend.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsernameIgnoreCaseAndPassword(String username, String password);
    Optional<User> findByUsernameIgnoreCaseAndReminder(String username, String reminder);
    Optional<User> findByUsernameIgnoreCase(String username);
}