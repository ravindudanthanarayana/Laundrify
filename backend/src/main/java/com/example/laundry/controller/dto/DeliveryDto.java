package com.example.laundry.controller.dto;

import com.example.laundry.model.Delivery;

public class DeliveryDto {

    public Long id;
    public String trackingNo;
    public String pickupTime;
    public String dropoffTime;
    public Long riderId;
    public Long orderRefId;
    public String status;

    public static DeliveryDto from(Delivery d) {
        DeliveryDto dto = new DeliveryDto();
        dto.id = d.getId();
        dto.trackingNo = d.getTrackingNo();
        dto.pickupTime = d.getPickupTime();
        dto.dropoffTime = d.getDropoffTime();
        dto.riderId = d.getRiderId();
        dto.orderRefId = d.getOrderRefId();
        dto.status = (d.getStatus() != null) ? d.getStatus().name() : null;
        return dto;
    }
}
