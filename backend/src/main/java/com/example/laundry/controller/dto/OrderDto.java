package com.example.laundry.controller.dto;

import com.example.laundry.model.Order;
import java.time.LocalDateTime;

public class OrderDto {
    public Long id;
    public Long customerId;
    public Double totalAmount;
    public String status;
    public LocalDateTime createdAt;

    public static OrderDto from(Order o) {
        OrderDto d = new OrderDto();
        d.id = o.getId();
        d.customerId = (o.getCustomer() != null ? o.getCustomer().getId() : null);
        d.totalAmount = o.getTotalAmount();
        d.status = (o.getStatus() != null ? o.getStatus().name() : null);
        d.createdAt = o.getCreatedAt();
        return d;
    }
}
