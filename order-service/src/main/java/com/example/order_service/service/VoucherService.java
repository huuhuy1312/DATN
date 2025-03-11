package com.example.order_service.service;

import com.example.order_service.common.UploadFile;
import com.example.order_service.dto.VoucherDto;
import com.example.order_service.dto.response.AllVoucherResponse;
import com.example.order_service.entity.Voucher;
import com.example.order_service.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoucherService {
    private final VoucherRepository voucherRepository;
    private final UploadFile uploadFile;
    public void add(VoucherDto voucherDto){
        try{

            Voucher voucher = Voucher.builder()
                    .code(voucherDto.getCode())
                    .maxQuantity(voucherDto.maxQuantity)
                    .type(voucherDto.getType())
                    .reduceMaxAmount(voucherDto.getReduceMaxAmount())
                    .conditionAmount(voucherDto.getConditionAmount())
                    .percentReduce(voucherDto.getPercentReduce())
                    .startDate(voucherDto.startDate)
                    .endDate(voucherDto.endDate)
                    .isActive(voucherDto.isActive)
                    .build();
            if(!ObjectUtils.isEmpty(voucherDto.id))
            {
                voucher.setId(voucherDto.getId());
            }
            System.out.printf(String.valueOf(voucherDto.isActive));
            voucherRepository.save(voucher);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu file");
        }
    }
    public Page<Voucher> findActiveVouchers(Pageable pageable){
        return voucherRepository.findActiveVouchers(LocalDateTime.now(),pageable);
    }
    public AllVoucherResponse findAllVoucher(){
        AllVoucherResponse allVoucherResponse = new AllVoucherResponse();
        allVoucherResponse.setListDiscountVoucher(voucherRepository.findAllActiveDiscountVoucher(LocalDateTime.now()));
        allVoucherResponse.setListShippingVoucher(voucherRepository.findAllActiveShippingVoucher(LocalDateTime.now()));
        return allVoucherResponse;
    }

}

