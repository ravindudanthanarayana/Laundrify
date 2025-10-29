package com.example.laundry.service;

import com.example.laundry.repository.UserRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@Primary
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var u = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Support both Enum and String roles
        String roleStr;
        try {
            // if it's an enum-like object with name()
            var method = u.getRole().getClass().getMethod("name");
            roleStr = String.valueOf(method.invoke(u.getRole()));
        } catch (Exception ignore) {
            // otherwise assume it's already a String
            roleStr = String.valueOf(u.getRole());
        }

        roleStr = roleStr == null ? "CUSTOMER" : roleStr.trim();
        if (roleStr.isEmpty()) roleStr = "CUSTOMER";

        // allow comma-separated roles too: "ADMIN,CS"
        String[] roles = Arrays.stream(roleStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toUpperCase)
                .toArray(String[]::new);

        if (roles.length == 0) roles = new String[]{"CUSTOMER"};

        return org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getPassword())
                .roles(roles) // Spring will prefix ROLE_
                .build();
    }
}
