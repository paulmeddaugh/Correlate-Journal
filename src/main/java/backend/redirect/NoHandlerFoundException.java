package backend.redirect;

public class NoHandlerFoundException extends RuntimeException {
	public NoHandlerFoundException() {
		super("Redirecting to home.");
	}
}
