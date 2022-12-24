package backend.note;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

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
import backend.connection.ConnectionRepository;
import backend.notebook.Notebook;
import backend.notebook.NotebookController;

@RestController
@RequestMapping("/api")
public class NoteController {
    
    private final NoteRepository repository;
    private final ConnectionRepository connRepository;
    private final NoteModelAssembler assembler;
    
    NoteController(NoteRepository repository, NoteModelAssembler assembler,
            ConnectionRepository connRepo) {
        this.repository = repository;
        this.assembler = assembler;
        this.connRepository = connRepo;
    }
    
    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping("/notes")
    CollectionModel<EntityModel<Note>> all() {
        List<EntityModel<Note>> notes = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());
        
        return CollectionModel.of(notes,
            linkTo(methodOn(NoteController.class).all()).withSelfRel());
    }
    // end::get-aggregate-root[]
    
    @PostMapping("/notes/new")
    Note newNote(@RequestBody Note newNote) {
        return repository.save(newNote);
    }
    
    // Single Notebook
    @GetMapping("/notes/{id}")
    EntityModel<Note> one(@PathVariable Long id) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException(id));
        
        return assembler.toModel(note);
    }
    
    @PutMapping("/notes/{id}/update")
    Note replaceNote(@RequestBody Note newNote, @PathVariable Long id) {
        return repository.findById(id)
            .map(Note -> {
                Note.setTitle(newNote.getTitle());
                Note.setText(newNote.getText());
                Note.setQuotes(newNote.getQuotes());
                Note.setIdNotebook(newNote.getIdNotebook());
                Note.setIdUser(newNote.getIdUser());
                Note.setMain(newNote.isMain());
                Note.setDateCreated(newNote.getDateCreated());
                return repository.save(Note);
            })
            .orElseGet(() -> {
                newNote.setId(id);
                return repository.save(newNote);
            });
    }
    
    @DeleteMapping("/notes/{id}/delete")
    @Transactional
    public void deleteNote(@PathVariable Long id) {
        repository.deleteById(id);
        connRepository.deleteByIdNote1OrIdNote2((int)(long) id,(int)(long) id);
    }
    
    // All of a user's notes
    @GetMapping("/users/{id}/notes")
    public CollectionModel<EntityModel<Note>> user(@PathVariable Long id) {
        List<EntityModel<Note>> notes = repository.findByIdUser((int) (long) id).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(notes,
                linkTo(methodOn(NoteController.class).user(id)).withSelfRel());
    }
}