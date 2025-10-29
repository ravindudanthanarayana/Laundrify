// src/main/java/com/example/laundry/repository/InvoiceRepository.java
package com.example.laundry.repository;

import com.example.laundry.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
