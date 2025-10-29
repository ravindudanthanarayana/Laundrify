package com.example.laundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "deliveries")
public class Delivery {

    public enum Status {
        ASSIGNED, DELIVERED, IN_TRANSIT, PICKED_UP
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_no", nullable = false, unique = true, length = 100)
    private String trackingNo;

    @Column(name = "pickup_time", length = 50)
    private String pickupTime;

    @Column(name = "dropoff_time", length = 50)
    private String dropoffTime;

    @Column(name = "rider", length = 100)
    private String rider;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "eta")
    private java.sql.Timestamp eta;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private Status status = Status.ASSIGNED;

    @Column(name = "driver_id")
    private Long riderId;

    @Column(name = "order_ref_id")
    private Long orderRefId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.sql.Timestamp createdAt;

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrackingNo() { return trackingNo; }
    public void setTrackingNo(String trackingNo) { this.trackingNo = trackingNo; }

    public String getPickupTime() { return pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

    public String getDropoffTime() { return dropoffTime; }
    public void setDropoffTime(String dropoffTime) { this.dropoffTime = dropoffTime; }

    public String getRider() { return rider; }
    public void setRider(String rider) { this.rider = rider; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public java.sql.Timestamp getEta() { return eta; }
    public void setEta(java.sql.Timestamp eta) { this.eta = eta; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Long getRiderId() { return riderId; }
    public void setRiderId(Long riderId) { this.riderId = riderId; }

    public Long getOrderRefId() { return orderRefId; }
    public void setOrderRefId(Long orderRefId) { this.orderRefId = orderRefId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }
}
