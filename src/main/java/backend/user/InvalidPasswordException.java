package backend.user;

public class InvalidPasswordException extends RuntimeException {

	InvalidPasswordException() {
		super("The password is does not match for this account.");
	}
}
