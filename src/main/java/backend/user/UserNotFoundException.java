package backend.user;

public class UserNotFoundException extends RuntimeException {
    UserNotFoundException(Long id) {
        super("Could not find user " + id);
    }
    UserNotFoundException(String username) {
        super("Could not find user with username " + username);
    }
    UserNotFoundException(String username, String password) {
        super("Could not find user with username " + username + " and password " 
                + password);
    }
}