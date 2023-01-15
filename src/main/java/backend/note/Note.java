package backend.note;

import java.util.Date;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Notes")
public class Note {
    private @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    private String title;
    @Column(columnDefinition = "LONGTEXT") private String text;
    @Column(columnDefinition = "LONGTEXT") private String quotes;
    private int idNotebook;
    private int idUser;
    private boolean isMain;
    private Date dateCreated;

    public Note() {
        super();
        this.dateCreated = new Date();
    }

    public Note(String title, String text, String quotes, int idUser, int idNotebook, 
            boolean isMain) {
        this();
        this.title = title;
        this.text = text;
        this.quotes = quotes;
        this.idNotebook = idNotebook;
        this.idUser = idUser;
        this.isMain = isMain;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getQuotes() {
        return quotes;
    }

    public void setQuotes(String quotes) {
        this.quotes = quotes;
    }

    public int getIdNotebook() {
        return idNotebook;
    }

    public void setIdNotebook(int idNotebook) {
        this.idNotebook = idNotebook;
    }

    public int getIdUser() {
        return idUser;
    }

    public void setIdUser(int idUser) {
        this.idUser = idUser;
    }

    public boolean isMain() {
        return isMain;
    }

    public void setMain(boolean isMain) {
        this.isMain = isMain;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Note))
            return false;
        
        Note client = (Note) o;
        return Objects.equals(this.id, client.id) 
                && Objects.equals(this.title, client.title)
                && Objects.equals(this.text, client.text)
                && Objects.equals(this.quotes, client.quotes)
                && Objects.equals(this.idNotebook, client.idNotebook)
                && Objects.equals(this.idUser, client.idUser)
                && Objects.equals(this.isMain, client.isMain)
                && Objects.equals(this.dateCreated, client.dateCreated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, 
                this.title,
                this.text,
                this.quotes,
                this.idNotebook,
                this.idUser,
                this.isMain,
                this.dateCreated);
    }

    @Override
    public String toString() {
        return "Note{" + "id=" + this.id 
                + ", title='" + this.title + '\'' 
                + ", text='" + this.text + '\'' 
                + ", quotes='" + this.quotes + '\'' 
                + ", idNotebook='" + this.idNotebook + '\'' 
                + ", idUser='" + this.idUser + '\'' 
                + ", isMain='" + this.isMain + '\'' 
                + ", dateCreated='" + this.dateCreated + '\''
                + '}';
    }
}
