package com.bezkoder.springjwt.services;

import com.bezkoder.springjwt.common.UploadFile;
import com.bezkoder.springjwt.models.Account;
import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.models.Seller;
import com.bezkoder.springjwt.payload.request.AddSellerRequest;
import com.bezkoder.springjwt.payload.request.FilterSellerRequest;
import com.bezkoder.springjwt.payload.request.RejectRequestToSellerRequest;
import com.bezkoder.springjwt.payload.request.UpdateSellerRequest;
import com.bezkoder.springjwt.payload.response.SellerFullInfoResponse;
import com.bezkoder.springjwt.payload.response.SellerHaveImageResponse;
import com.bezkoder.springjwt.payload.response.SellerResponse;
import com.bezkoder.springjwt.payload.response.StaticSellerInfo;
import com.bezkoder.springjwt.repository.AccountRepository;
import com.bezkoder.springjwt.repository.RoleRepository;
import com.bezkoder.springjwt.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerService {
    private final SellerRepository sellerRepository;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final UploadFile uploadFile;
    private final EmailServices emailServices;
//    @Autowired
//    private  ModelMapper modelMapper;

    @Autowired
    private RestTemplate restTemplate;

    public Seller findById(Long id) {
        return sellerRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found seller id=" + id));
    }

    public Seller findByAccountId(Long account_id) {
        return sellerRepository.findByAccountId(account_id);
    }

    //    public Seller register(RegisterToSellerRequest register){
//        Seller seller  = new Seller();
//        seller.se
//    }
    @Transactional
    public void addSeller(AddSellerRequest addSellerRequest) throws IOException {
        //Luu anh CCCD mat truoc
        Account account = accountRepository.findById(addSellerRequest.getAccountId()).get();
//        account.setRole(roleRepository.findByName(ERole.ROLE_SELLER).get());
//        accountRepository.save(account);

        Seller seller = new Seller();
        seller.setShopName(addSellerRequest.getShopName());
        seller.setEmail(addSellerRequest.getEmail());
        seller.setPhoneNumber(addSellerRequest.getPhoneNumber());
        seller.setCIN(addSellerRequest.getCIN());
        seller.setFullName(addSellerRequest.getFullName());
        seller.setAccount(account);
        seller.setIsActive(false);
        seller = sellerRepository.save(seller);
        List<MultipartFile> imageCICard = new ArrayList<>();
        imageCICard.add(addSellerRequest.getImageCICard());
        String idImageCICard = uploadFile.uploadFile(imageCICard, seller.getId(),"Image_CI_Card").getBody();

        List<MultipartFile> imageHoldCICard = new ArrayList<>();
        imageHoldCICard.add(addSellerRequest.getImageHoldCICard());
        String idImageHoldCICard = uploadFile.uploadFile(imageHoldCICard, seller.getId(),"Image_Hold_CI_Card").getBody();
        List<MultipartFile> avatarShop = new ArrayList<>();
        avatarShop.add(addSellerRequest.getAvatarShop());
        String avatarShopUp = uploadFile.uploadFile(avatarShop, seller.getId(),"SellerEntity").getBody();
    }

    public  List<SellerFullInfoResponse> findByIds(List<Long> ids){
        List<Seller> sellers = sellerRepository.findAllById(ids);
        List<SellerFullInfoResponse> responses = new ArrayList<>();
        for(Seller seller: sellers )
        {
            responses.add(new SellerFullInfoResponse(seller.getId(),seller.getShopName(),seller.getEmail(),seller.getPhoneNumber(),seller.getCIN(),seller.getFullName(),seller.getAccount().getId()));
        }
        return responses;
    }

    public SellerHaveImageResponse findById(long id){
        Seller seller = sellerRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy seller có id="+id));

        String imageCICardUrl = "http://localhost:8020/file/get-images?objectId=" + seller.getId() + "&objectName=Image_CI_Card";
        List<String> imageCICard = restTemplate.exchange(
                imageCICardUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<String>>() {}
        ).getBody();
        String imageHoldCICardUrl = "http://localhost:8020/file/get-images?objectId=" + seller.getId() + "&objectName=Image_Hold_CI_Card";
        List<String> imageHoldCICard = restTemplate.exchange(
                imageHoldCICardUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<String>>() {}
        ).getBody();
        return new SellerHaveImageResponse(seller.getId(),seller.getShopName(),seller.getEmail(),seller.getPhoneNumber(),seller.getCIN(),seller.getFullName(),imageCICard.get(0),imageHoldCICard.get(0),seller.getIsActive(),seller.getCreatedAt(),seller.getAccount().getId());
    }
    public SellerResponse getInfoById(long id){
        Seller seller = sellerRepository.findByAccountId(id);
        String url2 = "http://localhost:8020/file/get-images?objectId=" + seller.getId() + "&objectName=SellerEntity";
        List<String> image = restTemplate.exchange(
                url2,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<String>>() {}
        ).getBody();
        return new SellerResponse(seller.getId(),seller.getAccount().getId(),seller.getShopName(),seller.getFullName(),image.get(0));
    }


    public List<SellerResponse> getInfoByIds(List<Long> ids){
        List<Seller> sellers = sellerRepository.findByAccountIds(ids);
        List<SellerResponse> sellerResponses = new ArrayList<>();
        for (Seller seller: sellers) {
            String url2 = "http://localhost:8020/file/get-images?objectId=" + seller.getId() + "&objectName=SellerEntity";
            List<String> image = restTemplate.exchange(
                    url2,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {
                    }
            ).getBody();

            sellerResponses.add(new SellerResponse(seller.getId(),seller.getAccount().getId(), seller.getShopName(), seller.getFullName(), image.get(0)));
        }
        return sellerResponses;
    }

    public List<SellerFullInfoResponse> findAllSeller(){
        List<Seller> sellers = sellerRepository.findAll();
        List<SellerFullInfoResponse> responses = new ArrayList<>();
        for (Seller seller:sellers)
        {
            SellerFullInfoResponse response = new SellerFullInfoResponse(seller.getId(),seller.getShopName(),seller.getEmail(),seller.getPhoneNumber(),seller.getCIN(),seller.getFullName(),seller.getAccount().getId());
            responses.add(response);
        }
        return responses;
    }

    public List<SellerFullInfoResponse> search (FilterSellerRequest filter)
    {
        List<Seller> sellers = sellerRepository.findSellersByFilter(filter);
        List<SellerFullInfoResponse> responses = new ArrayList<>();
        for (Seller seller:sellers)
        {
            SellerFullInfoResponse response = new SellerFullInfoResponse(seller.getId(),seller.getShopName(),seller.getEmail(),seller.getPhoneNumber(),seller.getCIN(),seller.getFullName(),seller.getAccount().getId());
            responses.add(response);
        }
        return responses;
    }
    @Transactional
    public void handleReject(RejectRequestToSellerRequest request)
    {
        Seller seller = sellerRepository.findById(request.idSeller).get();
        emailServices.sendMail(seller.getEmail(),request.reason,"Thông tin đăng ký trở thành người bán chưa phù hợp");
        sellerRepository.deleteById(request.idSeller);
        String deleteUrl = "http://localhost:8020/api/address/delete-by-id?id=" + request.idAddress;

        ResponseEntity<Void> response = restTemplate.exchange(
                deleteUrl,
                HttpMethod.DELETE,
                null,
                Void.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Address deleted successfully");
        } else {
            System.out.println("Failed to delete address");
        }
    }
    public void handleAcceptShop(Long id){
        Seller seller = sellerRepository.findById(id).get();
        seller.setIsActive(true);
        Account account = seller.getAccount();
        Role role = roleRepository.findByName(ERole.ROLE_SELLER).get();
        account.setRole(role);
        account = accountRepository.save(account);
        seller.setAccount(account);
        sellerRepository.save(seller);
    }
    public List<StaticSellerInfo> staticSeller(){
        List<StaticSellerInfo> response = new ArrayList<>();
        List<Seller> sellers = sellerRepository.findSellersByFilter(new FilterSellerRequest());
        for (Seller seller:sellers)
        {

            StaticSellerInfo sellerInfo = new StaticSellerInfo(
                    seller.getId(),
                    seller.getFullName(),
                    seller.getPhoneNumber(),
                    seller.getShopName(),
                    seller.getCreatedAt(),
                    seller.getIsActive(),
                    seller.getIsDeleted()
            );
            sellerInfo.setIdAccount(seller.getAccount().getId());
            String imageCICardUrl = "http://localhost:8020/file/get-images?objectId=" + seller.getId() + "&objectName=Image_CI_Card";
            List<String> imageCICard = restTemplate.exchange(
                    imageCICardUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            ).getBody();
            String imageHoldCICardUrl = "http://localhost:8020/file/get-images?objectId=" + seller.getId() + "&objectName=Image_Hold_CI_Card";
            List<String> imageHoldCICard = restTemplate.exchange(
                    imageHoldCICardUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            ).getBody();
            sellerInfo.setImageCICard(imageCICard.get(0));
            sellerInfo.setImageHoldCICard(imageHoldCICard.get(0));
            sellerInfo.setReasonLock(seller.getReasonLock());
            sellerInfo.setCIN(seller.getCIN());
            sellerInfo.setCreatedAt(seller.getCreatedAt());
            if(seller.getIsDeleted())
            {
                sellerInfo.setReasonLock(sellerInfo.getReasonLock());
                sellerInfo.setDateLock(seller.getDateLock());
            }
            response.add(sellerInfo);
        }
        return response;
    }

    public void update(UpdateSellerRequest updateSellerRequest) {
        Seller seller = sellerRepository.findById(updateSellerRequest.id).get();
        if(!ObjectUtils.isEmpty(updateSellerRequest.getReasonLock()))
        {
            seller.setReasonLock(updateSellerRequest.getReasonLock());
        }
        if(!ObjectUtils.isEmpty(updateSellerRequest.isActive))
        {
            seller.setIsActive(updateSellerRequest.isActive);
        }
        if(!ObjectUtils.isEmpty(updateSellerRequest.isDeleted))
        {
            seller.setIsDeleted(updateSellerRequest.isDeleted);
            if(updateSellerRequest.isDeleted) seller.setDateLock(LocalDateTime.now());
            else seller.setDateLock(null);
        }
        sellerRepository.save(seller);
    }
}
