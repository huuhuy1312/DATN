package com.bezkoder.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class TOPRequestAdd {
    public Long id;
    public String label1;
    public String label2;
    public int quantity;
    public long price;
    public long cost;


}
