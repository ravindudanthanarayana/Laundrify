// src/main/java/com/example/laundry/controller/InvoiceController.java
package com.example.laundry.controller;

import com.example.laundry.controller.dto.InvoiceDto;
import com.example.laundry.model.Invoice;
import com.example.laundry.repository.InvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin
public class InvoiceController {

    private final InvoiceRepository repo;

    public InvoiceController(InvoiceRepository repo) {
        this.repo = repo;
    }

    /** List all invoices (ADMIN/CS) */
    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN','CS')")
    public List<InvoiceDto> listAll() {
        return repo.findAll().stream().map(InvoiceDto::fromEntity).toList();
    }

    /** Create invoice */
    @PostMapping("")
    @PreAuthorize("hasAnyRole('ADMIN','CS')")
    public ResponseEntity<InvoiceDto> create(@RequestBody InvoiceDto body) {
        Invoice saved = repo.save(body.toEntity());
        return ResponseEntity
                .created(URI.create("/api/invoices/" + saved.getId()))
                .body(InvoiceDto.fromEntity(saved));
    }

    /** Update invoice */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CS')")
    public ResponseEntity<InvoiceDto> update(@PathVariable Long id, @RequestBody InvoiceDto body) {
        return repo.findById(id).map(ex -> {
            // patch
            if (body.getAmount() != null) ex.setAmount(body.getAmount());
            if (body.getIssuedAt() != null) {
                try { ex.setIssuedAt(java.time.LocalDateTime.parse(body.getIssuedAt(),
                        java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME)); } catch (Exception ignored) {}
            }
            if (body.getStatus() != null) {
                try { ex.setStatus(Invoice.Status.valueOf(body.getStatus().trim().toUpperCase())); } catch (Exception ignored) {}
            }
            if (body.getOrderRefId() != null) ex.setOrderRefId(body.getOrderRefId());

            return ResponseEntity.ok(InvoiceDto.fromEntity(repo.save(ex)));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Delete invoice */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CS')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repo.findById(id).map(ex -> {
            repo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
