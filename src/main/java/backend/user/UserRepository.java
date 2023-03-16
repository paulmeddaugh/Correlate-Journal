package backend.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUsernameIgnoreCaseAndPassword(String username, String password);
    List<User> findByUsernameIgnoreCaseAndReminder(String username, String reminder);
    List<User> findByUsernameIgnoreCase(String username);
}