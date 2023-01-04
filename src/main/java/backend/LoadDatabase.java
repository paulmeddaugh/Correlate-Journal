package backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import backend.connection.Connection;
import backend.connection.ConnectionRepository;
import backend.note.Note;
import backend.note.NoteRepository;
import backend.notebook.Notebook;
import backend.notebook.NotebookRepository;
import backend.user.*;

@Configuration
public class LoadDatabase {
	private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

	@Bean
	CommandLineRunner initDatabase(UserRepository userRep, NotebookRepository notebookRep,
	        NoteRepository noteRep, ConnectionRepository connRep) {

		return args -> {
		    
		    // Users
			log.info("Preloading " + userRep.save(new User("AtLongLast", "Thoughts")));
			log.info("Preloading " + userRep.save(new User("BilboBaggins", "FromBagend")));
			log.info("Preloading " + userRep.save(new User("Gandolf", "YouShallNotPass")));
			log.info("Preloading " + userRep.save(
			        new User("paul.meddaugh@gmail.com", "PM174", "12345678", "12345678", "Paul")));
			
			// Notebooks
			log.info("Preloading " + notebookRep.save(new Notebook(1, "You're Lie In April")));
			log.info("Preloading " + notebookRep.save(new Notebook(1, "Life")));
			log.info("Preloading " + notebookRep.save(new Notebook(2, "Pirates of the Carribbean")));
			
			// Notes
			log.info("Preloading " + noteRep.save(
			        new Note("You're you,", "no matter what.", "- You're Lie In April", 1, 1, true)));
			log.info("Preloading " + noteRep.save(
			        new Note("Yet here you are,", "watering my withered heart with your smile.",
			                "- You're Lie In April", 1, 1, true)));
			log.info("Preloading " + noteRep.save(
                    new Note("When the lights come on", "will I be ready?", "", 1, 2, true)));
			log.info("Preloading " + noteRep.save(
                    new Note("Yo hoho", "and a bottle a rum",
                            "- Violet", 2, 1, true)));
            log.info("Preloading " + noteRep.save(
                    new Note("It's not that,", "it's just that I did not think you would "
                            + "like my answer", "- Violet", 2, 1, true)));

			// Connections
			//log.info("Preloading " + connRep.save(new Connection(1, 2, 1)));
			log.info("Preloading " + connRep.save(new Connection(2, 3, 1)));
			log.info("Preloading " + connRep.save(new Connection(4, 5, 2)));
		};
	}
}
