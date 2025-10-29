package com.example.laundry.controller;

import com.example.laundry.model.Task;
import com.example.laundry.repository.TaskRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<Task> all() { return repo.findAll(); }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public Task create(@RequestBody Task t) {
        return repo.save(t);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task in) {
        return repo.findById(id).map(ex -> {
            // copy whatever fields exist, but not id
            BeanUtils.copyProperties(in, ex, "id");
            return ResponseEntity.ok(repo.save(ex));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
