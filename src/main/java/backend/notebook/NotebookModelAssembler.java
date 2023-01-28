package backend.notebook;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class NotebookModelAssembler implements RepresentationModelAssembler<Notebook, EntityModel<Notebook>> {

    @Override
    public EntityModel<Notebook> toModel(Notebook notebooks) {
        return EntityModel.of(notebooks, 
            linkTo(methodOn(NotebookController.class).one(notebooks.getId())).withSelfRel(),
            linkTo(methodOn(NotebookController.class)
            		.user((Long)(long) notebooks.getIdUser())).withRel("notebooks"));
    }
    
}
