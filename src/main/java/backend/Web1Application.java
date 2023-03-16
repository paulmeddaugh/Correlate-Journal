package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class Web1Application {

	public static void main(String[] args) {
		SpringApplication.run(Web1Application.class, args);
	}
	
//	private static final String PATH = "/error";
//
//    @RequestMapping(value = PATH)
//    public String error() {
//        return "forward:/index.html";
//    }
//
//    public String getErrorPath() {
//        return PATH;
//    }
	
}