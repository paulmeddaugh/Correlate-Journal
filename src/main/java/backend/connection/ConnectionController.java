package backend.connection;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import backend.LoadDatabase;
import backend.notebook.Notebook;
import backend.notebook.NotebookController;
import backend.user.User;
import backend.user.UserController;
import backend.user.UserNotFoundException;

@RestController
public class ConnectionController {
    
    private final ConnectionRepository repository;
    private final ConnectionModelAssembler assembler;
    private ObjectMapper objectMapper;
    
    ConnectionController(ConnectionRepository repository, 
            ConnectionModelAssembler assembler, ObjectMapper objectMapper) {
        this.repository = repository;
        this.assembler = assembler;
        this.objectMapper = objectMapper;
    }
    
    // Aggregate root
    @GetMapping("/connections")
    CollectionModel<EntityModel<Connection>> all() {
        List<EntityModel<Connection>> notes = repository.findAll().stream()
            .map(assembler::toModel)
            .collect(Collectors.toList());
        
        return CollectionModel.of(notes,
            linkTo(methodOn(ConnectionController.class).all()).withSelfRel());
    }
    
    /**
     * Creates one or more connections, with ability to receive multiple
     * values in the second 'idNote2' separated by commas to add multiple
     * connections to the first note id.
     * 
     * @param idNote1 An int value of the first note's id in the database.
     * @param idNote2 One or more int values, separated by commas, of note
     * id's connected to the first note's id.
     * @param idUser The id of the user the connections belong to.
     * @return True if successful.
     */
    @PostMapping("/connections/new")
    CollectionModel<EntityModel<Connection>> newConnection(@RequestParam int idNote1, 
            @RequestParam List<Integer> idNote2, @RequestParam int idUser) {
        
        List<Connection> conns = new ArrayList<>();
        idNote2.forEach((id2) -> {
            conns.add(new Connection(idNote1, id2, idUser));
            repository.save(conns.get(conns.size() - 1));
        });
        
        List<EntityModel<Connection>> conn = conns
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(conn,
                linkTo(methodOn(ConnectionController.class)
                        .newConnection(idNote1, idNote2, idUser)).withSelfRel());
    }
    
    // Creating multiple connections
    @PostMapping("/connections/newMultiple")
    CollectionModel<EntityModel<Connection>> newConnections(@RequestBody Connection[] newConnections) {
        for (Connection c : newConnections) {
            repository.save(c);
        }
        
        List<EntityModel<Connection>> conn = List.of(newConnections)
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(conn,
                linkTo(methodOn(ConnectionController.class)
                        .newConnections(newConnections)).withSelfRel());
    }
    
    // Getting a connection by id
    @GetMapping("/connections/{id}")
    EntityModel<Connection> one(@PathVariable Long id) {
        Connection conn = repository.findById(id)
                .orElseThrow(() -> new ConnectionNotFoundException(id));
        
        return assembler.toModel(conn);
    }
    
    // Query for a connection from a note to another
    @GetMapping("/connections/query")
    CollectionModel<EntityModel<Connection>> fromIdNote1AndIdNote2(
            @RequestParam Integer idNote1, @RequestParam Integer idNote2,
            @RequestParam Integer idUser) {
        
        List<EntityModel<Connection>> conn = repository
                .findByIdNote1AndIdNote2AndIdUser(idNote1, idNote2, idUser)
                .stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        if (conn.size() == 0) {
            // Searches for idNote1 with idNote2 val, and idNote2 with idNote1 val
            conn = repository
                    .findByIdNote1AndIdNote2AndIdUser(idNote2, idNote1, idUser)
                    .stream()
                    .map(assembler::toModel)
                    .collect(Collectors.toList());
        }
        
        if (conn.size() == 0) {
            throw new ConnectionNotFoundException(idNote1, idNote2);
        }
        
        return CollectionModel.of(conn,
                linkTo(methodOn(ConnectionController.class)
                        .fromIdNote1AndIdNote2(idNote1, idNote2, idUser)).withSelfRel());
    }
    
    // Deletes a connection by id
    @DeleteMapping("/connections/delete/{id}")
    void deleteConnection(@PathVariable Long id) {
        repository.deleteById(id);
    }
    
    /**
     * Deletes a connection using parameters. Can additionally accept multiple
     * values in the second 'idNote2' separated by commas to delete multiple
     * connections to the first note id.
     * 
     * @param idNote1 An int value of the first note's id in the database.
     * @param idNote2 One or more int values, separated by commas, of note
     * id's connected to the first note's id.
     * @param idUser The id of the user the connections belong to.
     */
    @DeleteMapping("/connections/delete")
    @Transactional
    public void deleteConnection(@RequestParam Integer idNote1, @RequestParam List<Integer> idNote2,
            @RequestParam Integer idUser) {
        idNote2.forEach((id2) -> {
            if (repository.deleteByIdNote1AndIdNote2AndIdUser(idNote1, id2, idUser).size() == 0) {
                repository.deleteByIdNote1AndIdNote2AndIdUser(id2, idNote1, idUser);
            }
        });
    }
    
    // (Doesn't work) Deletes multiple connections
    @DeleteMapping("/connections/deleteMultiple")
    void deleteConnections(@RequestParam String connections) throws JsonMappingException, JsonProcessingException {
        Connection[] conns = objectMapper.readValue(connections, Connection[].class);
        for (Connection c : conns) {
            int id1 = c.getIdNote1(), id2 = c.getIdNote2(), idUser = c.getIdUser();
            if (repository.deleteByIdNote1AndIdNote2AndIdUser(id1, id2, idUser) == null) {
                repository.deleteByIdNote1AndIdNote2AndIdUser(id2, id1, idUser);
            }
        }
    }
    
    // All of a user's connections
    @GetMapping("/users/{id}/connections")
    public CollectionModel<EntityModel<Connection>> user(@PathVariable Long id) {
        List<EntityModel<Connection>> conns = repository.findByIdUser((int) (long) id).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        
        return CollectionModel.of(conns,
                linkTo(methodOn(ConnectionController.class).user(id)).withSelfRel());
    }
}