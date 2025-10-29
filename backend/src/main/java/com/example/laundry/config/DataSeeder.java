package com.example.laundry.config;

import com.example.laundry.model.User;
import com.example.laundry.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initUsers(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.count() == 0) {
                User admin = new User();
                admin.setEmail("admin@laundry.com");
                admin.setName("Admin");
                admin.setPassword(encoder.encode("Admin123@")); // plain → bcrypt
                admin.setRole("ADMIN");
                repo.save(admin);

                User staff = new User();
                staff.setEmail("staff@laundry.com");
                staff.setName("Staff");
                staff.setPassword(encoder.encode("Staff123@"));
                staff.setRole("STAFF");
                repo.save(staff);
            }
        };
    }
}
