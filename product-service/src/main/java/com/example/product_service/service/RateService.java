package com.example.product_service.service;


import com.example.product_service.common.UploadFile;
import com.example.product_service.dto.request.AddRateRequest;
import com.example.product_service.dto.response.RateOfProductResponse;
import com.example.product_service.dto.response.RateResponse;
import com.example.product_service.entity.Rate;
import com.example.product_service.entity.TypeOfProduct;
import com.example.product_service.repository.RateRepository;
import com.example.product_service.repository.TypeOfProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RateService {
    private final RateRepository rateRepository;
    private final TypeOfProductRepository typeOfProductRepository;
    private final UploadFile uploadFile;
    private final RestTemplate restTemplate;
    @Transactional
    public void addRate(AddRateRequest addRateRequest) throws IOException {
        TypeOfProduct typeOfProduct = typeOfProductRepository.findById(addRateRequest.getTypeOfProductId())
                .orElseThrow(()->new RuntimeException("Not found type of product with id= "+addRateRequest.getTypeOfProductId()));
        Rate rate = new Rate(addRateRequest.getItemId(), addRateRequest.getCustomerId(), addRateRequest.getContent(),addRateRequest.getRateStar(),typeOfProduct);
        Rate rate1 = rateRepository.save(rate);
        if(!ObjectUtils.isEmpty(addRateRequest.getFiles()))uploadFile.uploadFile(addRateRequest.getFiles(),rate1.getId(),"RateEntity");

    }
    public RateOfProductResponse findByProductId(Long idProduct) {
        List<Rate> rates = rateRepository.findByProductId(idProduct);

        // Initialize counters for each star rating
        long rate5Star = 0;
        long rate4Star = 0;
        long rate3Star = 0;
        long rate2Star = 0;
        long rate1Star = 0;
        double totalStars = 0; // Sum of all stars for calculating the average

        List<RateResponse> rateResponses = new ArrayList<>();

        for (Rate rate : rates) {
            // Count each rating
            switch (rate.getRateStar()) {
                case 5:
                    rate5Star++;
                    break;
                case 4:
                    rate4Star++;
                    break;
                case 3:
                    rate3Star++;
                    break;
                case 2:
                    rate2Star++;
                    break;
                case 1:
                    rate1Star++;
                    break;
            }

            // Accumulate total stars for calculating the average
            totalStars += rate.getRateStar();

            // Construct RateResponse and add it to the list
            RateResponse rateResponse = new RateResponse(
                    rate.getId(),
                    rate.getCustomerId(),
                    rate.getCreatedDate(),
                    rate.getContent(),
                    rate.getReplySeller(),
                    rate.getTypeOfProduct().getLabel1(),
                    rate.getTypeOfProduct().getLabel2(),
                    rate.getCustomerName()
            );

            // Fetch images for the rate
            String url = "http://localhost:8020/file/get-images?objectId=" + rate.getId() + "&objectName=RateEntity";
            List<String> imageRates = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<String>>() {}
            ).getBody();

            rateResponse.setImages(imageRates);
            rateResponse.setRateStar(rate.getRateStar());
            rateResponses.add(rateResponse);
        }

        // Calculate the average rating
        double averageRate = rates.isEmpty() ? 0 : totalStars / rates.size();

        // Construct the result object
        RateOfProductResponse result = new RateOfProductResponse(
                averageRate,
                rate5Star,
                rate4Star,
                rate3Star,
                rate2Star,
                rate1Star,
                (long) rates.size(),
                rateResponses
        );

        return result;
    }

}
