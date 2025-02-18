package com.kipcollo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

import com.kipcollo.model.Roles;
import com.kipcollo.repository.RoleRepository;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	public CommandLineRunner runner(RoleRepository repository) {
		return args -> {
			if (repository.findByName("USER").isEmpty()) {
				repository.save(
						Roles.builder().name("USER").build()
				);
			}
			if (repository.findByName("ADMIN").isEmpty()) {
				repository.save(
						Roles.builder().name("ADMIN").build()
				);
			}
			if (repository.findByName("DOCTOR").isEmpty()) {
				repository.save(
						Roles.builder().name("DOCTOR").build()
				);
			}
		};

	}

}
