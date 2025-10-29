package com.example.laundry.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.laundry.model.Task;
public interface TaskRepository extends JpaRepository<Task, Long>{}
