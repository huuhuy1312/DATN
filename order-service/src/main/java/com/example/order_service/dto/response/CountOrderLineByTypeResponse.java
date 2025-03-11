package com.example.order_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CountOrderLineByTypeResponse {
    public Long total;
    public Long waitConfirm;
    public Long confirmed;
    public Long processing;
    public Long waitPickUp;
    public Long pickedUp;
    public Long deliveringToDestinationWarehouse;
    public Long atDestinationWarehouse;
    public Long deliveringToReceiver;
    public Long done;
}
