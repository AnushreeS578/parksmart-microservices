package eureka_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
	
	//starts the spring boot application and launches embedded server
	public static void main(String[] args) {
		SpringApplication.run(EurekaServerApplication.class, args);
	}

}
