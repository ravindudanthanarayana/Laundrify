package com.example.laundry.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User customer;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PLACED;

    private Double totalAmount = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status { PLACED, PROCESSING, READY, OUT_FOR_DELIVERY, COMPLETED, CANCELED }

    // ---------- Getters/Setters ----------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
