package backend.user;

public class UserAlreadyExistsException extends RuntimeException {
	UserAlreadyExistsException(String username) {
        super("Username " + username + " already exists");
    }
	UserAlreadyExistsException(String username, String email) {
        super(constructExceptionMessage(username, email));
    }
	
	private static String constructExceptionMessage (String username, String email) {
		String message = "";
		
		if (username != null) message += "Username '" + username + "' already exists";
		if (email != null) {
			message += ((message != "") ? " and e" : "E") + "mail '" + email + "' already exists";
		}
		
		return message + ".";
	}
}