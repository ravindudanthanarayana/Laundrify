// src/main/java/com/example/laundry/model/Invoice.java
package com.example.laundry.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // DECIMAL/NUMERIC column expect BigDecimal
    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;   // null වැඩිම බැරි නැතිනම් keep nullable

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.DRAFT;

    @Column(name = "order_ref_id")
    private Long orderRefId;

    public enum Status {
        DRAFT, ISSUED, PAID, VOID
    }
}
