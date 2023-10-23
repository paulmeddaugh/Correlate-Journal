package backend.user;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Users")
public class PublicUser {
	
    private @Id Long id;
    private String email;
    private String username;
    private Date dateCreated;
    private String name;

    public PublicUser() {
        super();
    }

    public PublicUser(String username) {
        this();
        this.username = username;
    }
    
    public PublicUser(Long id, String email, String username, String name, Date dateCreated) {
        this(username);
        this.id = id;
        this.email = email;
        this.name = name;
        this.dateCreated = dateCreated;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof User))
            return false;
        PublicUser client = (PublicUser) o;
        return Objects.equals(this.id, client.id) 
                && Objects.equals(this.email, client.email)
                && Objects.equals(this.username, client.username)
                && Objects.equals(this.name, client.name)
                && Objects.equals(this.dateCreated, client.dateCreated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, 
                this.email,
                this.username,
                this.name,
                this.dateCreated);
    }

    @Override
    public String toString() {
        return "User{" + "id=" + this.id 
                + ", email='" + this.email + '\'' 
                + ", username='" + this.username + '\''
                + ", name='" + this.name + '\'' 
                + ", dateCreated='" + this.dateCreated + '\'' 
                + '}';
    }
    
    public static PublicUser fromUser(User user) {
    	return new PublicUser(
			user.getId(), 
			user.getEmail(), 
			user.getUsername(), 
			user.getName(), 
			user.getDateCreated()
		);
    }
}
