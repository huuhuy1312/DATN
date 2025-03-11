package com.example.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RateResponse {
    public Long id;//
    public Long customerId;//
    public String label1;//
    public String label2;//
    public Date createdDate;//
    public String content;//
    public List<String> images;//
    public String replySeller;//
    public String customerName;//
    public Integer rateStar;
    public RateResponse(Long id, Long customerId, Date createdDate, String content, String replySeller,String label1,String label2,String customerName) {
        this.id = id;
        this.customerId = customerId;
        this.createdDate = createdDate;
        this.content = content;
        this.replySeller = replySeller;
        this.label1 = label1;
        this.label2 = label2;
        this.customerName = customerName;
    }
}
