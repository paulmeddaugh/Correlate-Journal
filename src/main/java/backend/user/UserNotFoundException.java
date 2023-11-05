package backend.user;

public class UserNotFoundException extends RuntimeException {
	
	public UserNotFoundException() {
        super("Could not find user.");
    }
    UserNotFoundException(Long id) {
        super("Could not find user with id " + id);
    }
    public UserNotFoundException(String username) {
        super("Could not find user with username, '" + username + ".'");
    }
    UserNotFoundException(String username, String password) {
        super("Could not find user with username, '" + username + "' and password, '" 
                + password + ".'");
    }
}