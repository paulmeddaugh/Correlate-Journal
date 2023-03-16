package backend.user;

public class UserAlreadyExistsException extends RuntimeException {
	UserAlreadyExistsException(String username) {
        super("Username " + username + " already exists");
    }
}