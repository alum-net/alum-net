package org.alumnet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class AlumNetApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlumNetApplication.class, args);
	}

}
