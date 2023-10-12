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
//			log.info("Preloading " + userRep.save(new User("admin", "password")));
//			log.info("Preloading " + userRep.save(new User("AtLongLast", "Thoughts")));
//			log.info("Preloading " + userRep.save(new User("BilboBaggins", "FromBagend")));
//			log.info("Preloading " + userRep.save(new User("Gandolf", "YouShallNotPass")));
//			
//			// Notebooks
//			log.info("Preloading " + notebookRep.save(new Notebook(2, "You're Lie In April")));
//			log.info("Preloading " + notebookRep.save(new Notebook(2, "Life")));
//			
//			// Notes
//			log.info("Preloading " + noteRep.save(
//			        new Note("You're you,", "no matter what.", "- You're Lie In April", 2, 1, true)));
//			log.info("Preloading " + noteRep.save(
//			        new Note("Yet here you are,", "watering my withered heart with your smile.",
//			                "- You're Lie In April", 2, 1, true)));
//			log.info("Preloading " + noteRep.save(
//                    new Note("When the lights come on", "will I be ready?", "", 2, 2, true)));
//
//			// Connections
//			log.info("Preloading " + connRep.save(new Connection(2, 3, 1)));

		};
	}
}
