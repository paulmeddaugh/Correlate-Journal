package backend.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;

public class SecurePassword {
	
	public static String[] generateSecurePassword(String password) {	
		String hashedPassword = null;
		String salt = null;
		try {
			salt = getSalt();
			hashedPassword = get_SHA_256_SecurePassword(password, salt);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new String[] { salt, hashedPassword };
	}
	
	public static String getHashedPassword (String passwordToHash, String salt) {
		return get_SHA_256_SecurePassword(passwordToHash, salt);
	}
	
	private static String get_SHA_256_SecurePassword(String passwordToHash,
            String salt) {
        String generatedPassword = null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes());
            byte[] bytes = md.digest(passwordToHash.getBytes());
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16)
                        .substring(1));
            }
            generatedPassword = sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return generatedPassword;
    }
	
	//Add salt
	private static String getSalt()
	        throws NoSuchAlgorithmException, NoSuchProviderException 
	{
	    // Always use a SecureRandom generator
	    SecureRandom sr = SecureRandom.getInstance("SHA1PRNG", "SUN");

	    // Create array for salt
	    byte[] salt = new byte[16];

	    // Get a random salt
	    sr.nextBytes(salt);

	    // return salt
	    return salt.toString();
	}
	
	
}
