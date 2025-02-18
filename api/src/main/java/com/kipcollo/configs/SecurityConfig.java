package com.kipcollo.configs;

import com.kipcollo.service.CustomerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

   private final JwtFilter jwtAuthFilter;
   private final CustomerService userDetailsService;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
     http
           .cors(Customizer.withDefaults())
           .csrf(AbstractHttpConfigurer::disable)
           .authorizeHttpRequests(req ->
                          req.requestMatchers(
                             "/auth/**",
                             "/api/medicines/all",
                             "api/medicines/",
                             "/v2/api-docs",
                             "/v3/api-docs",
                             "/v3/api-docs/**",
                             "/swagger-resources",
                             "/swagger-resources/**",
                             "/configuration/ui",
                             "/configuration/security",
                             "swagger-ui/**",
                             "/swagger-ui.html"
                             ).permitAll()
                                      .anyRequest()
                                      .authenticated())

           .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
           .authenticationProvider(authenticationProvider())
         //   .httpBasic(Customizer.withDefaults())
           .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

     return http.build();
  }

   @Bean
   public AuthenticationProvider authenticationProvider(){
       DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
       authProvider.setUserDetailsService(userDetailsService);
       authProvider.setPasswordEncoder(passwordEncoder());

       return authProvider;
   }

   @Bean
   public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
   }

   @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
      return authenticationConfiguration.getAuthenticationManager();
   }

   @Bean
   public AuditorAware<Integer> auditorAware(){
      return new ApplicationAuditAware();
   }

    @Bean
    public CorsFilter corsFilter(){
      final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      final CorsConfiguration config = new CorsConfiguration();
      config.setAllowCredentials(true);
      config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
      config.setAllowedHeaders(Arrays.asList(HttpHeaders.ORIGIN,HttpHeaders.CONTENT_TYPE,HttpHeaders.ACCEPT,HttpHeaders.AUTHORIZATION));
      config.setAllowedMethods(Arrays.asList("GET","POST","DELETE","PUT","PATCH"));
      source.registerCorsConfiguration("/**", config);
      return new CorsFilter(source);
   }

}
