package com.example.laundry.controller;

import com.example.laundry.controller.dto.DeliveryDto;
import com.example.laundry.model.Delivery;
import com.example.laundry.repository.DeliveryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryRepository repo;

    public DeliveryController(DeliveryRepository repo) {
        this.repo = repo;
    }

    // ✅ Get all deliveries
    @GetMapping
    public List<DeliveryDto> list() {
        return repo.findAll().stream().map(DeliveryDto::from).toList();
    }

    // ✅ Get by ID
    @GetMapping("/{id}")
    public DeliveryDto get(@PathVariable Long id) {
        Delivery d = repo.findById(id).orElseThrow();
        return DeliveryDto.from(d);
    }

    // ✅ Create new delivery
    @PostMapping
    public DeliveryDto create(@RequestBody DeliveryDto input) {
        Delivery d = new Delivery();
        d.setTrackingNo(input.trackingNo);
        d.setPickupTime(input.pickupTime);
        d.setDropoffTime(input.dropoffTime);
        d.setRiderId(input.riderId);
        d.setOrderRefId(input.orderRefId);
        d.setStatus(input.status != null
                ? Delivery.Status.valueOf(input.status)
                : Delivery.Status.ASSIGNED);
        return DeliveryDto.from(repo.save(d));
    }

    // ✅ Update existing delivery
    @PutMapping("/{id}")
    public DeliveryDto update(@PathVariable Long id, @RequestBody DeliveryDto input) {
        Delivery d = repo.findById(id).orElseThrow();
        if (input.trackingNo != null) d.setTrackingNo(input.trackingNo);
        if (input.pickupTime != null) d.setPickupTime(input.pickupTime);
        if (input.dropoffTime != null) d.setDropoffTime(input.dropoffTime);
        if (input.riderId != null) d.setRiderId(input.riderId);
        if (input.orderRefId != null) d.setOrderRefId(input.orderRefId);
        if (input.status != null) d.setStatus(Delivery.Status.valueOf(input.status));
        return DeliveryDto.from(repo.save(d));
    }

    // ✅ Update status only
    @PutMapping("/{id}/status")
    public DeliveryDto updateStatus(@PathVariable Long id, @RequestBody DeliveryDto input) {
        Delivery d = repo.findById(id).orElseThrow();
        if (input.status != null) d.setStatus(Delivery.Status.valueOf(input.status));
        return DeliveryDto.from(repo.save(d));
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
