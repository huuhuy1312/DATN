package com.bezkoder.springjwt.repository.custom;

import com.bezkoder.springjwt.payload.response.ItemInCartDetailsResponse;
import com.bezkoder.springjwt.payload.response.SectionOfCartResponse;

import java.util.List;

public interface CustomItemInCartRepository {
    List<ItemInCartDetailsResponse> findItemsInCartByCartId(long cart_id);
}
