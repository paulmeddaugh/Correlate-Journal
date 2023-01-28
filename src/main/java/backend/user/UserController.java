package backend.user;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.LoadDatabase;
import backend.connection.Connection;
import backend.connection.ConnectionController;
import backend.connection.ConnectionModelAssembler;
import backend.connection.ConnectionRepository;
import backend.note.Note;
import backend.note.NoteController;
import backend.note.NoteModelAssembler;
import backend.note.NoteRepository;
import backend.notebook.Notebook;
import backend.notebook.NotebookController;
import backend.notebook.NotebookModelAssembler;
import backend.notebook.NotebookRepository;

@RestController
@RequestMapping("/api")
public class UserController {
    
    private final UserRepository userRepository;
    private final NotebookRepository nbRepository;
    private final NoteRepository noteRepository;
    private final ConnectionRepository connRepository;
    private final UserModelAssembler userAssembler;
    private final NotebookModelAssembler nbAssembler;
    private final NoteModelAssembler noteAssembler;
    private final ConnectionModelAssembler connAssembler;
    
    UserController(UserRepository userRepository, NotebookRepository nbRepository,
            NoteRepository noteRepository, ConnectionRepository connRepository, 
            UserModelAssembler userAssembler, NotebookModelAssembler nbAssembler, 
            NoteModelAssembler noteAssembler, ConnectionModelAssembler connAssembler) {
        this.userRepository = userRepository;
        this.nbRepository = nbRepository;
        this.noteRepository = noteRepository;
        this.connRepository = connRepository;
        this.userAssembler = userAssembler;
        this.noteAssembler = noteAssembler;
        this.nbAssembler = nbAssembler;
        this.connAssembler = connAssembler;
    }
    
    @GetMapping("/users/{id}/getJournal")
    CollectionModel<Object> userJournal(@PathVariable Long id) {
        
        int idUser = (int) (long) id;
        List<EntityModel<Notebook>> notebooks = nbRepository.findByIdUser(idUser).stream()
                .map(nbAssembler::toModel)
                .collect(Collectors.toList());
        CollectionModel<EntityModel<Notebook>> nbColl = CollectionModel.of(notebooks,
                linkTo(methodOn(NotebookController.class).user(id)).withSelfRel());
        
        List<EntityModel<Note>> notes = noteRepository.findByIdUser(idUser).stream()
                .map(noteAssembler::toModel)
                .collect(Collectors.toList());
        CollectionModel<EntityModel<Note>> noteColl = CollectionModel.of(notes,
                linkTo(methodOn(NoteController.class).user(id)).withSelfRel());
        
        List<EntityModel<Connection>> conns = connRepository.findByIdUser(idUser).stream()
                .map(connAssembler::toModel)
                .collect(Collectors.toList());
        CollectionModel<EntityModel<Connection>> connColl = CollectionModel.of(conns,
                linkTo(methodOn(ConnectionController.class).user(id)).withSelfRel());
        
        List<Object> l = new ArrayList<>();
        l.add(nbColl);
        l.add(noteColl);
        l.add(connColl);
        
        return CollectionModel.of(l,
                linkTo(methodOn(UserController.class).userJournal(id)).withSelfRel());
    }
    
    @PostMapping("/users/newUser")
    User newUser(@RequestBody User newUser) {
        return userRepository.save(newUser);
    }
    
    // Single User
    @GetMapping("/users/{id}")
    EntityModel<User> one(@PathVariable Long id) {
        User User = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        
        return userAssembler.toModel(User);
    }
    
    // Collection of users with username and password
    @GetMapping("/users")
    CollectionModel<EntityModel<User>> all(
            @RequestParam(required = false) String username, 
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String reminder) {
        
        List<EntityModel<User>> users = new ArrayList<>();
        
        if (username != null && password != null) { // Username and password params
        	
        	// Encrypts password
        	String encodedPw = "";
        	int i = 0;
        	char e = 'A';

        	for (char c : password.toCharArray()) {
        	  encodedPw += String.valueOf((((int) c - 80) * 13) + (i += 9)) + (char)(e += 3);
        	}
        	
            users = userRepository
                    .findByUsernameIgnoreCaseAndPassword(username, encodedPw)
                    .stream()
                    .map(userAssembler::toModel)
                    .collect(Collectors.toList());
        } else if (username != null && reminder != null) { // Username and reminder params
            users = userRepository
                    .findByUsernameIgnoreCaseAndReminder(username, reminder)
                    .stream()
                    .map(userAssembler::toModel)
                    .collect(Collectors.toList());
        } else {
            users = userRepository.findAll().stream()
                .map(userAssembler::toModel)
                .collect(Collectors.toList());
        }
        
        
        
        if (users.size() == 0) {
            throw new UserNotFoundException(username, password);
        }
        
        return CollectionModel.of(users,
                linkTo(methodOn(UserController.class)
                        .all(username, password, null)).withSelfRel());
    }
    
    @PutMapping("/users/{id}/updateUser")
    User replaceUser(@RequestBody User newUser, @PathVariable Long id) {
        return userRepository.findById(id)
            .map(User -> {
                User.setEmail(newUser.getEmail());
                User.setUsername(newUser.getUsername());
                User.setPassword(newUser.getPassword());
                User.setReminder(newUser.getReminder());
                User.setName(newUser.getName());
                User.setDateCreated(newUser.getDateCreated());
                return userRepository.save(User);
            })
            .orElseGet(() -> {
                newUser.setId(id);
                return userRepository.save(newUser);
            });
    }
    
    @DeleteMapping("/users/{id}/deleteUser")
    void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}