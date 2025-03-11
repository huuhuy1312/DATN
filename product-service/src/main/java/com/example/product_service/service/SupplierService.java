package com.example.product_service.service;

import com.example.product_service.entity.Supplier;
import com.example.product_service.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;

    public void addSupplier(String nameSupplier){
        supplierRepository.save(new Supplier(nameSupplier));
    }

    public List<Supplier> findAll(){
        return supplierRepository.findAll();
    }
}
