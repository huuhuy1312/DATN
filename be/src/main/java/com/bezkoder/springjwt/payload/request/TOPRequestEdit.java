package com.bezkoder.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class TOPRequestEdit {
    public Long id;
    public String label1;
    public String label2;
    public int quantity;
    public long price;
    public long cost;

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + id +
                ",\"label1\":\"" + label1 + "\"" +
                ",\"label2\":\"" + label2 + "\"" +
                ",\"quantity\":" + quantity +
                ",\"price\":" + price +
                ",\"cost\":" + cost +
                "}";
    }
}
