package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Seller;
import com.bezkoder.springjwt.notification.NotificationProducer;
import com.bezkoder.springjwt.payload.request.AddSellerRequest;
import com.bezkoder.springjwt.payload.request.FilterSellerRequest;
import com.bezkoder.springjwt.payload.request.RejectRequestToSellerRequest;
import com.bezkoder.springjwt.payload.request.UpdateSellerRequest;
import com.bezkoder.springjwt.payload.response.*;
import com.bezkoder.springjwt.repository.SellerRepository;

import com.bezkoder.springjwt.services.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("api/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "*",maxAge = 3600)
public class SellerController {
    private final SellerService sellerService;
    private final NotificationProducer notificationProducer;
    @PostMapping("/add")
    public ResponseEntity<?> addSeller(@ModelAttribute AddSellerRequest addSellerRequest) throws IOException {
        System.out.println(addSellerRequest);
        sellerService.addSeller(addSellerRequest);
        return ResponseEntity.ok("Them thanh cong");
    }

    @GetMapping("/findByAccountId")
    public ResponseEntity< ResponseObject<Seller>> findSellerById(@RequestParam(name = "account_id")Long account_id){
        return ResponseEntity.ok(new ResponseObject<>(HttpStatus.OK, 200, sellerService.findByAccountId(account_id)));
    }


    @GetMapping("/find-by-id")
    public ResponseEntity<SellerHaveImageResponse> findSellerById(@RequestParam(name="id") long id){
        return ResponseEntity.ok(sellerService.findById(id));
    }

    @GetMapping("/find-by-ids")
    public ResponseEntity<List<SellerFullInfoResponse>> findSellerById(@RequestParam(name="ids") List<Long> ids){
        return ResponseEntity.ok(sellerService.findByIds(ids));
    }
    @GetMapping("/get-info-by-id")
    public ResponseEntity<SellerResponse> getShopNameById(@RequestParam(name="id") long id){
        return ResponseEntity.ok(sellerService.getInfoById(id));
    }

    @GetMapping("/get-info-by-ids")
    public ResponseEntity<List<SellerResponse>> getShopNameByIds(@RequestParam(name="ids") List<Long> ids){
        return ResponseEntity.ok(sellerService.getInfoByIds(ids));
    }
    @GetMapping("/findAll")
    public ResponseEntity<?> findAll()
    {
        return ResponseEntity.ok(sellerService.findAllSeller());
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody FilterSellerRequest filter)
    {
        return ResponseEntity.ok(sellerService.search(filter));
    }

    @PostMapping("/reject-request")
    public ResponseEntity<?> rejectRequest(@RequestBody RejectRequestToSellerRequest request)
    {
        sellerService.handleReject(request);
        ResultResponse response2 = new ResultResponse("Nguyen Van B",
                "Từ chối","Số CCCD không hợp lệ","Shop si le hot trend","flslayder1312@gmail.com");
        notificationProducer.sendNotification(response2);
        return ResponseEntity.ok("Từ chối thành công");
    }

    @PostMapping("/accept-request")
    public ResponseEntity<?> rejectRequest(@RequestParam("id") Long id)
    {
        sellerService.handleAcceptShop(id);
        ResultResponse response = new ResultResponse("Nguyen Van B",
                "Chấp thuận",null,"Shop si le hot trend","flslayder1312@gmail.com");
        notificationProducer.sendNotification(response);
        return ResponseEntity.ok("Chấp thuận yêu cầu thành công");
    }

    @GetMapping("/static-seller")
    public ResponseEntity<List<StaticSellerInfo>> staticSeller(){
        return ResponseEntity.ok(sellerService.staticSeller());
    }

    @PostMapping("/update")
    public ResponseEntity<?> lockShop(@RequestBody UpdateSellerRequest updateSellerRequest)
    {
        sellerService.update(updateSellerRequest);
        return ResponseEntity.ok("Thao tác thành công");
    }

}
