package backend.media;

//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.CacheControl;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import java.util.concurrent.TimeUnit;

//@Configuration
//public class MediaController implements WebMvcConfigurer {
//
//    @Override
//    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/static/media/**")
//                .addResourceLocations("/static/media/")
//                .setCacheControl(CacheControl.maxAge(60 * 60, TimeUnit.SECONDS)
//                        .noTransform()
//                        .cachePublic());
//        
//	    // Resources controlled by Spring Security, which
//	    // adds "Cache-Control: must-revalidate".
////	    registry.addResourceHandler("/static/**")
////	        	.addResourceLocations("classpath:/**")
////	        	.setCachePeriod(3600*24);
//    }
//}

//import javax.servlet.http.HttpServletResponse;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class MediaController {
//	@GetMapping("/static/media/**")
//	public String media(HttpServletResponse response) {
//	    response.setHeader("Cache-Control", "no-transform, public, max-age=86400");
//	    System.out.println("no cache control");
//	    return "media";
//	}
//}