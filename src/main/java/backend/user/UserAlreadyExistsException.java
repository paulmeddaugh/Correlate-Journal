package backend.user;

public class UserAlreadyExistsException extends RuntimeException {
	UserAlreadyExistsException(String username) {
        super("Username " + username + " already exists");
    }
	UserAlreadyExistsException(String username, String email) {
        super("Account with email '" + email + "' already exists.");
    }
}