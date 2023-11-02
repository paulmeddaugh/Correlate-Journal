package backend.user;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
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
import backend.resetPassword.GenericResponse;

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
    
    private final UserService userService;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    UserController(UserRepository userRepository, NotebookRepository nbRepository,
            NoteRepository noteRepository, ConnectionRepository connRepository, 
            UserModelAssembler userAssembler, NotebookModelAssembler nbAssembler, 
            NoteModelAssembler noteAssembler, ConnectionModelAssembler connAssembler,
            UserService userService) {
        this.userRepository = userRepository;
        this.nbRepository = nbRepository;
        this.noteRepository = noteRepository;
        this.connRepository = connRepository;
        this.userAssembler = userAssembler;
        this.noteAssembler = noteAssembler;
        this.nbAssembler = nbAssembler;
        this.connAssembler = connAssembler;
        this.userService = userService;
    }
    
    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal CustomUserDetails userDetails, @AuthenticationPrincipal OAuth2User oauth2UserDetails) {
    	
    	User user = ((userDetails != null)
    			? userRepository.findById(userDetails.getId())
    			: userRepository.findByUsernameIgnoreCase(oauth2UserDetails.getAttribute("email"))
    		).orElseThrow(() -> new UserNotFoundException());
    	
        return Collections.singletonMap("user", user.toPublicUser());
    }
    
    @GetMapping("/updatePassword/{id}")
    public void updatePassword(@PathVariable Long id) {
//    	List<User> users = userRepository.findAll();
    	
//    	for (User user : users) {
    		
    		try {
    			
    			User user = userRepository.findById(id)
    					.orElseThrow(() -> new UserNotFoundException(id));
    			
	    		String encoded = user.getPassword();
	    		String password = "";
	    		
	    		char e = 'D';
	        	
	        	ArrayList<String> ss = new ArrayList<>(40);
	        	ss.add("");
	        	char[] cs = encoded.toCharArray();
	        	
	        	for (char c : cs) {
	        	    
	        	    if (c == e) {
	        	    	ss.add("");
	        	        e += (char) 3;
	        	        
	        	        continue;
	        	    }
	        	    
	        	    int lastIndex = ss.size() - 1;
	        	    ss.set(lastIndex, ss.get(lastIndex) + c);
	        	}
	        	
	        	for (int i = 0; i < ss.size(); i++) {
	        	    if (ss.get(i) == "") continue;
	        	    
	        	    int ascii = Integer.parseInt(ss.get(i));
	        	    char c = (char) (((ascii / 13) + 80) - (i - (i / 3)));
	        	    password += c;
	        	}
	        	
	        	String bCryptPassword = passwordEncoder.encode(password);
	        	
	        	user.setPassword(bCryptPassword);
	        	userRepository.save(user);
	        	
    		} catch (Exception e) {
    			System.out.println("Could not update password for user with id " + String.valueOf(id));
    		}
        	
//    	}
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
    @ResponseStatus(code = HttpStatus.CREATED)
    User newUser(@RequestBody User newUser) {
    	if (userRepository.findByUsernameIgnoreCase(newUser.getUsername()).isEmpty()) {
    		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
    		return userRepository.save(newUser);
    	} else {
    		throw new UserAlreadyExistsException(newUser.getUsername());
    	}
    }
    
    // Single User
    @GetMapping("/users/{id}")
    EntityModel<PublicUser> one(@PathVariable Long id) {
        User User = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        
        return userAssembler.toModel(User.toPublicUser());
    }
    
    // Collection of users with username and password
    @GetMapping("/users")
    CollectionModel<EntityModel<PublicUser>> all(
            @RequestParam(required = true) String username, 
            @RequestParam(required = false) String password) {
        
        List<EntityModel<PublicUser>> users = new ArrayList<>();
        
//        if (username != null && password != null) { // Username and password params
//        	
//        	// Encrypts password
////        	String encodedPw = "";
////        	int i = 0;
////        	char e = 'A';
////
////        	for (char c : password.toCharArray()) {
////        	  encodedPw += String.valueOf((((int) c - 80) * 13) + (i += 9)) + (char)(e += 3);
////        	}
        
//        String encoded = "425D239G482J491M552P457S505V332Y";
//        String pw = "";
//        
//        int i = 0;
//    	char e = 'D';
    	

//    	for (char c : password.toCharArray()) {
//    	  encodedPw += String.valueOf(
//    	      (((int) c - 80) * 13) + (i += 9))
//    	      + (char)(e += 3);
//    	}
    	
    	
//        	
////        	EntityModel<PublicUser> u = userAssembler.toModel(userRepository.findByUsernameIgnoreCase(username).get().toPublicUser());
//        	
//            users = userRepository
//                    .findByUsernameIgnoreCase(username)
//                    .stream()
//                    .map(PublicUser::fromUser)
//                    .map(userAssembler::toModel)
//                    .collect(Collectors.toList());
//            
//        } else if (username != null) { // Only username param
//            users = userRepository
//                    .findByUsernameIgnoreCase(username)
//                    .stream()
//                    .map(PublicUser::fromUser)
//                    .map(userAssembler::toModel)
//                    .collect(Collectors.toList());
//        }
//        
//        if (users.size() == 0) {
//            throw (password != null) 
//            	? new UserNotFoundException(username, password) 
//            	: new UserNotFoundException(username);
//        }
        
        return CollectionModel.of(users,
                linkTo(methodOn(UserController.class)
                        .all(username, password)).withSelfRel());
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