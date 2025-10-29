// src/main/java/com/example/laundry/controller/dto/InvoiceDto.java
package com.example.laundry.controller.dto;

import com.example.laundry.model.Invoice;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class InvoiceDto {
    private Long id;
    private BigDecimal amount;
    private String issuedAt;     // API හරහා String
    private String status;       // DRAFT/ISSUED/PAID/VOID
    private Long orderRefId;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public static InvoiceDto fromEntity(Invoice inv) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(inv.getId());
        dto.setAmount(inv.getAmount());
        dto.setIssuedAt(inv.getIssuedAt() != null ? inv.getIssuedAt().format(ISO) : null);
        dto.setStatus(inv.getStatus() != null ? inv.getStatus().name() : null);
        dto.setOrderRefId(inv.getOrderRefId());
        return dto;
    }

    public Invoice toEntity() {
        Invoice inv = new Invoice();
        inv.setId(this.id);
        inv.setAmount(this.amount);
        if (this.issuedAt != null && !this.issuedAt.isBlank()) {
            inv.setIssuedAt(LocalDateTime.parse(this.issuedAt, ISO));
        }
        if (this.status != null && !this.status.isBlank()) {
            try {
                inv.setStatus(Invoice.Status.valueOf(this.status.trim().toUpperCase()));
            } catch (Exception ignored) {
                // invalid value -> keep default DRAFT
            }
        }
        inv.setOrderRefId(this.orderRefId);
        return inv;
    }
}
