package com.kipcollo.configs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Pharmacy Management System APIs",
        description = "APIs for Pharmacy Management system",
        termsOfService = "Include later",
        version = "1.0.0"
       ),servers = @Server(description = "localhost:8080"))
public class SwaggerConfig{
}
