package com.example.laundry.controller;

import com.example.laundry.controller.dto.OrderDto;
import com.example.laundry.model.Order;
import com.example.laundry.model.User;
import com.example.laundry.repository.OrderRepository;
import com.example.laundry.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderRepository repo;
    private final UserRepository users;

    public OrderController(OrderRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    /* ================= helpers ================= */

    private boolean isStaff(Authentication a) {
        if (a == null) return false;
        for (GrantedAuthority ga : a.getAuthorities()) {
            String role = ga.getAuthority();
            if ("ROLE_ADMIN".equals(role) || "ROLE_CS".equals(role)) return true;
        }
        return false;
    }

    private Double toDouble(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.doubleValue();
        if (v instanceof String s) {
            try { return Double.parseDouble(s.trim()); } catch (Exception ignored) {}
        }
        return null;
    }

    private Long toLong(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.longValue();
        if (v instanceof String s) {
            try { return Long.parseLong(s.trim()); } catch (Exception ignored) {}
        }
        return null;
    }

    private Order.Status toStatus(Object v) {
        if (v == null) return null;
        if (v instanceof String s) {
            String norm = s.trim().toUpperCase().replace(' ', '_');
            try { return Order.Status.valueOf(norm); } catch (Exception ignored) {}
        }
        return null;
    }

    /* ================= LISTS ================= */

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN','CS')")
    public List<OrderDto> listAll() {
        return repo.findAll().stream().map(OrderDto::from).toList();
    }

    @GetMapping("/my")
    public List<OrderDto> myOrders(Authentication auth) {
        String email = auth.getName();
        return repo.findByCustomer_Email(email).stream().map(OrderDto::from).toList();
    }

    /* ================= GET ONE ================= */

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOne(@PathVariable Long id) {
        return repo.findById(id)
                .map(OrderDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.<OrderDto>notFound().build());
    }

    /* ================= CREATE ================= */

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN','CS')")
    public ResponseEntity<OrderDto> create(@RequestBody CreateOrderReq in) {
        Optional<User> customer = users.findById(in.customerId);
        if (customer.isEmpty()) return ResponseEntity.badRequest().<OrderDto>build();

        Order o = new Order();
        o.setCustomer(customer.get());
        o.setTotalAmount(in.totalAmount != null ? in.totalAmount : 0.0);
        if (in.status != null) {
            try {
                o.setStatus(Order.Status.valueOf(in.status.toUpperCase()));
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().<OrderDto>build();
            }
        }
        Order saved = repo.save(o);
        return ResponseEntity.ok(OrderDto.from(saved));
    }

    /* ================= UPDATE (PUT/PATCH share same core) ================= */

    private ResponseEntity<OrderDto> applyOrderUpdates(Long id, Map<String, Object> body, Authentication auth) {
        return repo.findById(id).map(ex -> {
            boolean staff = isStaff(auth);
            boolean owner = ex.getCustomer() != null
                    && auth != null
                    && ex.getCustomer().getEmail() != null
                    && ex.getCustomer().getEmail().equalsIgnoreCase(auth.getName());

            if (!staff && !owner) {
                return ResponseEntity.status(403).<OrderDto>build();
            }

            boolean changed = false;

            // totalAmount (owner + staff)
            if (body.containsKey("totalAmount")) {
                Double amt = toDouble(body.get("totalAmount"));
                if (amt != null) {
                    ex.setTotalAmount(amt);
                    changed = true;
                }
            }

            // status (staff any; owner only CANCELED)
            if (body.containsKey("status")) {
                Order.Status st = toStatus(body.get("status"));
                if (st != null) {
                    if (owner && !staff) {
                        if (st == Order.Status.CANCELED) {
                            ex.setStatus(st);
                            changed = true;
                        } // else ignore
                    } else {
                        ex.setStatus(st);
                        changed = true;
                    }
                }
            }

            // customerId (staff only)
            if (body.containsKey("customerId") && staff) {
                Long cid = toLong(body.get("customerId"));
                if (cid != null) {
                    users.findById(cid).ifPresent(ex::setCustomer);
                    changed = true;
                }
            }

            if (!changed) {
                return ResponseEntity.badRequest().<OrderDto>build();
            }

            return ResponseEntity.ok(OrderDto.from(repo.save(ex)));
        }).orElse(ResponseEntity.<OrderDto>notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> update(@PathVariable Long id,
                                           @RequestBody Map<String, Object> body,
                                           Authentication auth) {
        return applyOrderUpdates(id, body, auth);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<OrderDto> patch(@PathVariable Long id,
                                          @RequestBody Map<String, Object> body,
                                          Authentication auth) {
        return applyOrderUpdates(id, body, auth);
    }

    /* ================= UPDATE STATUS (explicit) ================= */

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(@PathVariable Long id,
                                                 @RequestBody Map<String, String> body,
                                                 Authentication auth) {
        String status = body.get("status");
        if (status == null) return ResponseEntity.badRequest().<OrderDto>build();

        return repo.findById(id).map(ex -> {
            boolean staff = isStaff(auth);
            boolean owner = ex.getCustomer() != null
                    && auth != null
                    && ex.getCustomer().getEmail() != null
                    && ex.getCustomer().getEmail().equalsIgnoreCase(auth.getName());

            if (!staff && !owner) {
                return ResponseEntity.status(403).<OrderDto>build();
            }

            Order.Status st = toStatus(status);
            if (st == null) return ResponseEntity.badRequest().<OrderDto>build();

            if (owner && !staff && st != Order.Status.CANCELED) {
                return ResponseEntity.status(403).<OrderDto>build();
            }

            ex.setStatus(st);
            return ResponseEntity.ok(OrderDto.from(repo.save(ex)));
        }).orElse(ResponseEntity.<OrderDto>notFound().build());
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    // wildcard avoids Void/Object generic inference issues
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        return repo.findById(id).map(ex -> {
            boolean staff = isStaff(auth);
            boolean owner = ex.getCustomer() != null
                    && auth != null
                    && ex.getCustomer().getEmail() != null
                    && ex.getCustomer().getEmail().equalsIgnoreCase(auth.getName());

            if (!staff && !owner) {
                return ResponseEntity.status(403).build();
            }

            if (owner && !staff && ex.getStatus() != Order.Status.PLACED) {
                return ResponseEntity.status(409).build(); // only PLACED deletable by owner
            }

            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ================= DTO for create ================= */

    public static class CreateOrderReq {
        public Long customerId;
        public Double totalAmount;
        public String status;
    }
}
