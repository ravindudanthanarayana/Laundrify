package com.example.laundry.controller;

import com.example.laundry.controller.dto.UserDto;
import com.example.laundry.model.User;
import com.example.laundry.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UsersController(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository; this.encoder = encoder;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> list() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(UserDto::from).toList());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateReq req) {
        try {
            if (req.email == null || req.email.isBlank()) return ResponseEntity.badRequest().body("email is required");
            if (req.password == null || req.password.isBlank()) return ResponseEntity.badRequest().body("password is required");
            String email = req.email.trim().toLowerCase();
            if (userRepository.findByEmailIgnoreCase(email).isPresent())
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");

            User u = new User();
            u.setEmail(email);
            u.setName(req.name);
            u.setPhone(req.phone);
            u.setRole(req.role == null || req.role.isBlank() ? "CUSTOMER" : req.role.toUpperCase());
            u.setPassword(encoder.encode(req.password));

            return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.from(userRepository.save(u)));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateReq req) {
        Optional<User> maybe = userRepository.findById(id);
        if (maybe.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        User u = maybe.get();
        if (req.name != null) u.setName(req.name);
        if (req.phone != null) u.setPhone(req.phone);
        if (req.role != null && !req.role.isBlank()) u.setRole(req.role.toUpperCase());
        if (req.email != null && !req.email.isBlank()) {
            String newEmail = req.email.trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(u.getEmail()) && userRepository.findByEmailIgnoreCase(newEmail).isPresent())
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            u.setEmail(newEmail);
        }
        if (req.password != null && !req.password.isBlank()) u.setPassword(encoder.encode(req.password));
        return ResponseEntity.ok(UserDto.from(userRepository.save(u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id); return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails p) {
        if (p == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        return userRepository.findByEmailIgnoreCase(p.getUsername())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(UserDto.from(u)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    // payloads
    public static class CreateReq { public String name,email,phone,role,password; }
    public static class UpdateReq { public String name,email,phone,role,password; }
}
