package com.example.laundry.config;

import com.example.laundry.service.AppUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final AppUserDetailsService userDetails;

    public SecurityConfig(AppUserDetailsService userDetails) {
        this.userDetails = userDetails;
    }

    /* ===== Authentication Beans ===== */

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider(PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(encoder);
        provider.setUserDetailsService(userDetails);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       DaoAuthenticationProvider provider) throws Exception {
        AuthenticationManagerBuilder amb = http.getSharedObject(AuthenticationManagerBuilder.class);
        amb.authenticationProvider(provider);
        return amb.build();
    }

    /* ===== Fixed CORS Configuration ===== */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();

        // ✅ Allowed frontend URLs (update if needed)
        cors.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173"
        ));

        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("*"));
        cors.setExposedHeaders(List.of("Authorization"));
        cors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

    /* ===== Main Security Filter Chain ===== */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ❌ Disable CSRF for REST APIs
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS using above bean
                .cors(Customizer.withDefaults())

                // ✅ Stateless API
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ✅ Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public routes
                        .requestMatchers("/", "/error", "/actuator/health").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // Users
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "CS")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                        .requestMatchers("/api/users/me").authenticated()

                        // ✅ Orders & Deliveries (authenticated)
                        .requestMatchers("/api/orders/**", "/api/deliveries/**").authenticated()

                        // ✅ Invoices (Admin, CS)
                        .requestMatchers("/api/invoices/**").hasAnyRole("ADMIN", "CS")

                        // ✅ Tasks (Admin, Staff)
                        .requestMatchers("/api/tasks/**").hasAnyRole("ADMIN", "STAFF")

                        // ✅ Everything else
                        .anyRequest().authenticated()
                )

                // Basic Auth for now (or can switch to JWT later)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
