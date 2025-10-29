package com.example.laundry.model;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter @Setter
@Table(name="tasks")
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Order orderRef;

    @ManyToOne
    private User assignee; // staff

    @Enumerated(EnumType.STRING)
    private Status status = Status.QUEUED;

    private LocalDate dueDate;

    public enum Status { QUEUED, IN_PROGRESS, DONE }
}
