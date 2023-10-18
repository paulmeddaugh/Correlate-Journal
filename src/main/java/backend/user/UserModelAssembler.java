package backend.user;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class UserModelAssembler implements RepresentationModelAssembler<PublicUser, EntityModel<PublicUser>> {

    @Override
    public EntityModel<PublicUser> toModel(PublicUser user) {
        return EntityModel.of(user, 
            linkTo(methodOn(UserController.class).one(user.getId())).withSelfRel(),
            linkTo(methodOn(UserController.class).all(null, null)).withRel("users"));
    }
    
}
