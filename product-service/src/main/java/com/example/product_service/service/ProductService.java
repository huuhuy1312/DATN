package com.example.product_service.service;

import com.example.product_service.common.UploadFile;
import com.example.product_service.dto.TypeOfProductDto;
import com.example.product_service.dto.request.AddProductRequest;
import com.example.product_service.dto.request.FilterProductRequest;
import com.example.product_service.dto.response.*;
import com.example.product_service.entity.*;
import com.example.product_service.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final UploadFile uploadFile;

    private final ImageClassificationRepository imageClassificationRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final TypeOfProductRepository typeOfProductRepository;
    private final RestTemplate restTemplate;
    @Transactional
    public void add(AddProductRequest addProductRequest) throws IOException {
        System.out.println(addProductRequest.toString());
        Category category =  categoryRepository.findById(addProductRequest.categoryId).orElseThrow(()->new RuntimeException("Không tìm thấy category có id ="+addProductRequest.categoryId));
        Supplier supplier =  supplierRepository.findById(addProductRequest.supplierId).orElseThrow(()->new RuntimeException("Không tìm thấy supplier có id = "+addProductRequest.supplierId));

//        String url = "http://localhost:8080/api/seller/find-address?account_id=" + addProductRequest.sellerId;
//        String address = restTemplate.getForObject(url, String.class);

        String address = "Thành phố Hà Nội";
        Product product = new Product(addProductRequest.name,addProductRequest.title1,addProductRequest.title2,addProductRequest.sellerId,category,supplier,address);
        productRepository.save(product);

            List<MultipartFile> fileDescription = new ArrayList<>();
            fileDescription.add(addProductRequest.description);
            uploadFile.uploadFile(fileDescription, product.getId(), "ProductDescription");

        Set<String> label1 = new LinkedHashSet<>();
        // Xử lý các TOP
        ObjectMapper objectMapper = new ObjectMapper();
        TypeOfProductDto[] topRequestAdds = objectMapper.readValue(addProductRequest.listTypeOfProduct, TypeOfProductDto[].class);
        for (int i=0;i<topRequestAdds.length;i++){
            TypeOfProduct typeOfProduct = new TypeOfProduct(topRequestAdds[i].label1,topRequestAdds[i].label2,topRequestAdds[i].quantity,topRequestAdds[i].price,topRequestAdds[i].cost,product,topRequestAdds[i].weight,topRequestAdds[i].originalPrice);
            label1.add(typeOfProduct.getLabel1());
            typeOfProductRepository.save(typeOfProduct);
        }
        List<String> label1List = new ArrayList<>(label1);
        if(addProductRequest.imageLabel1s!=null){
            for (int i=0;i<addProductRequest.imageLabel1s.size();i++){
                ImageClassification imageClassification = new ImageClassification(label1List.get(i),product);
                List<MultipartFile> imageList = new ArrayList<>();
                imageList.add(addProductRequest.imageLabel1s.get(i));
                ImageClassification imageClassification1 = imageClassificationRepository.save(imageClassification);
                uploadFile.uploadFile(imageList, imageClassification1.getId(), "ImageClassificationImage");

            }
        }
        System.out.println(addProductRequest.imageProducts.size());
        uploadFile.uploadFile(addProductRequest.imageProducts, product.getId(), "ProductImage");
    }
    public void edit(AddProductRequest addProductRequest) throws IOException {
        System.out.println(addProductRequest.toString());
        Category category =  categoryRepository.findById(addProductRequest.categoryId).orElseThrow(()->new RuntimeException("Không tìm thấy category có id ="+addProductRequest.categoryId));
        Supplier supplier =  supplierRepository.findById(addProductRequest.supplierId).orElseThrow(()->new RuntimeException("Không tìm thấy supplier có id = "+addProductRequest.supplierId));

        String address = "Thành phố Hà Nội";
        Product product = productRepository.findById(addProductRequest.id).get();
        product.setName(addProductRequest.name);
        product.setTitle1(addProductRequest.title1);
        product.setTitle2(addProductRequest.title2);
        product.setSellerId(addProductRequest.sellerId);
        product.setCategory(category);
        product.setSupplier(supplier);
        productRepository.save(product);

        if(!ObjectUtils.isEmpty(addProductRequest.description))
        {
            List<MultipartFile> fileDescription = new ArrayList<>();
            fileDescription.add(addProductRequest.description);
            uploadFile.uploadFile(fileDescription, product.getId(), "ProductDescription");
            String url = "http://localhost:8020/file/softDelete?objectName=ProductDescription&objectId=" +addProductRequest.id;
            String abc = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    null,
                    new ParameterizedTypeReference<String>() {}
            ).getBody();
        }
        Set<String> label1 = new LinkedHashSet<>();
        // Xử lý các TOP
        typeOfProductRepository.softDeleteByProductId(addProductRequest.id);
        ObjectMapper objectMapper = new ObjectMapper();
        TypeOfProductDto[] topRequestAdds = objectMapper.readValue(addProductRequest.listTypeOfProduct, TypeOfProductDto[].class);

        for (int i=0;i<topRequestAdds.length;i++){
            TypeOfProduct typeOfProduct = new TypeOfProduct(topRequestAdds[i].id,topRequestAdds[i].label1,topRequestAdds[i].label2,topRequestAdds[i].quantity,topRequestAdds[i].price,topRequestAdds[i].cost,product,topRequestAdds[i].weight,topRequestAdds[i].originalPrice);
            label1.add(typeOfProduct.getLabel1());
            typeOfProductRepository.save(typeOfProduct);
        }
        List<String> label1List = new ArrayList<>(label1);
        String url = "http://localhost:8020/file/softDelete?objectName=ImageClassificationImage&objectId=" +addProductRequest.id;
        String def = restTemplate.exchange(
                url,
                HttpMethod.POST,
                null,
                new ParameterizedTypeReference<String>() {}
        ).getBody();
        if(!ObjectUtils.isEmpty(addProductRequest.imageLabel1s)){
            for (int i=0;i<addProductRequest.imageLabel1s.size();i++){
                ImageClassification imageClassification = new ImageClassification(label1List.get(i),product);
                List<MultipartFile> imageList = new ArrayList<>();
                imageList.add(addProductRequest.imageLabel1s.get(i));
                ImageClassification imageClassification1 = imageClassificationRepository.save(imageClassification);
                uploadFile.uploadFile(imageList, imageClassification1.getId(), "ImageClassificationImage");
            }
        }
        if(!ObjectUtils.isEmpty(addProductRequest.imageProducts)) {
            uploadFile.uploadFile(addProductRequest.imageProducts, product.getId(), "ProductImage");
        }
    }
    public int getTotalRates(Product product) {
        int totalRates = 0;
        for (TypeOfProduct typeOfProduct : product.getTypesOfProducts()) {
            totalRates += typeOfProduct.getRates().size();
        }
        return totalRates;
    }
    public List<ProductDetailsResponse> handleProductToProductResponse(List<Product> products)
    {
        List<ProductDetailsResponse> list = new ArrayList<>();
        List<Long> sellerIds = products.stream()
                .map(Product::getSellerId) // Lấy sellerId từ mỗi product
                .distinct() // Lọc các ID trùng lặp
                .toList();

        String urlSeller = "http://localhost:8080/api/seller/get-info-by-ids?ids="
                + sellerIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
        List<SellerInfoResponse> sellers = restTemplate.exchange(
                urlSeller,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<SellerInfoResponse>>() {
                }
        ).getBody();
        for (Product product: products){
            ProductDetailsResponse productDetailsResponse = new ProductDetailsResponse(
                    product.getId(),
                    product.getName(),
                    product.getTitle2(),
                    product.getTitle1(),
                    product.getOrigin(),
                    new CategoryResponse(product.getCategory().getId(),product.getCategory().getName()),
                    product.getSupplier());
            Category category = product.getCategory();
            List<String> categoriesResponse = new ArrayList<>();
            while (category != null)
            {
                categoriesResponse.add(category.getName());
                category = category.getCategoryParent();
            }
            productDetailsResponse.setCategories(categoriesResponse);
            productDetailsResponse.setCreatedAt(product.getCreatedAt());
            productDetailsResponse.setCountRates(getTotalRates(product));
            List<TypeOfProductInProductResponse> typeOfProductInProductResponses = new ArrayList<>();
            Set<String> setLabel1 = new HashSet<>();
            Set<String> setLabel2 = new HashSet<>();
            for (TypeOfProduct item: product.getTypesOfProducts()){
                if(!item.getIsDeleted()) {
                    String url = "http://localhost:8085/api/item/count-total-sold-quantity?typeOfProductId=" + item.getId();
                    Long soldQuantity = restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<Long>() {
                            }
                    ).getBody();
                    TypeOfProductInProductResponse response = new TypeOfProductInProductResponse(item.getId(), item.getLabel1(), item.getLabel2(), item.getQuantity(), item.getOriginalPrice(), item.getPrice(), item.getCost(), item.getWeight(), soldQuantity, soldQuantity * item.getPrice());
                    typeOfProductInProductResponses.add(response);
                    setLabel2.add(item.getLabel2());
                    setLabel1.add(item.getLabel1());
                }
            }
            productDetailsResponse.setListLabel1(setLabel1.stream().toList());
            productDetailsResponse.setListLabel2(setLabel2.stream().toList());
            productDetailsResponse.setTypeOfProducts(typeOfProductInProductResponses);

            //lay anh
            String url = "http://localhost:8081/file/get-info-images?objectId=" + product.getId() + "&objectName=ProductImage";
            List<FileInfoResponse> imageProducts = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<FileInfoResponse>>() {}
            ).getBody();
            productDetailsResponse.setImageProducts(imageProducts);
            //Xu ly anh phan loai
            List<ImageClassificationResponse> imageClassificationResponses = new ArrayList<>();
            for (ImageClassification imageClassification :product.getImageClassificationsList()){
                if(!imageClassification.getIsDeleted()) {
                    String url2 = "http://localhost:8081/file/get-info-images?objectId=" + imageClassification.getId() + "&objectName=ImageClassificationImage";
                    List<FileInfoResponse> imageClassificationRes = restTemplate.exchange(
                            url2,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<FileInfoResponse>>() {
                            }
                    ).getBody();
                    ImageClassificationResponse response = new ImageClassificationResponse(imageClassification.getId(), imageClassificationRes.get(0), imageClassification.getClassification1(), imageClassification.getProduct().getId());
                    imageClassificationResponses.add(response);
                }
            }
            productDetailsResponse.setImageClassifications(imageClassificationResponses);
            String urlDes = "http://localhost:8081/file/read-description-file?objectName=ProductDescription&objectId="+product.getId();
            String description = restTemplate.exchange(
                    urlDes,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<String>() {}
            ).getBody();
            productDetailsResponse.setDescription(description);
            for (SellerInfoResponse seller: sellers) {
                if (Objects.equals(seller.idAccount, product.getSellerId())) {
                    productDetailsResponse.setSeller(seller);
                }

            }
            list.add(productDetailsResponse);

        }
        return list;
    }
    public List<ProductDetailsResponse> findBySellerId(Long sellerId) {
        List<Product> productPageable = productRepository.findBySellerId(sellerId);
        return handleProductToProductResponse(productPageable);
    }

    public List<ProductDetailsResponse> getAll(){
        return handleProductToProductResponse(productRepository.findAllActiveProducts());
    }

    public ProductDetailsResponse findById(Long id){
        Product product = productRepository.findById(id)
                .filter(p -> !p.getIsDeleted())  // Lọc sản phẩm chưa bị xóa
                .orElseThrow(() -> new RuntimeException("Not found product with id=" + id));
        List<Product>   products = new ArrayList<>();
        products.add(product);
        return  handleProductToProductResponse(products).get(0);
    }

    public List<TOPRevenueResponse> calRevenue(String objectName, Long objectId) {
        List<TypeOfProduct> tops = new ArrayList<>();
        if (objectName.equals("Product")) {
            tops = typeOfProductRepository.findByProductId(objectId);
        } else {
           tops = typeOfProductRepository.findBySellerId(objectId);
        }
        String ids  = tops.stream()
                .map(TypeOfProduct::getId) // Extracts the ID from each TypeOfProduct
                .map(String::valueOf) // Converts each ID to a String
                .collect(Collectors.joining(","));
        String url = "http://localhost:8020/api/item/count-sold-quantity?ids=" + ids;

        List<TOPSoldQuantityResponse> list = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<TOPSoldQuantityResponse>>() {}
        ).getBody();

        List<TypeOfProduct> typeOfProducts = typeOfProductRepository.findAllById(
                list.stream().map(TOPSoldQuantityResponse::getTypeOfProductId).toList()
        );

        List<TOPRevenueResponse> topRevenueResponses = new ArrayList<>();

        for (TOPSoldQuantityResponse item : list) {
            TOPRevenueResponse topRevenueResponse = new TOPRevenueResponse();
            topRevenueResponse.setTypeOfProductId(item.getTypeOfProductId());
            topRevenueResponse.setYear(item.getYear());
            topRevenueResponse.setMonth(item.getMonth());
            topRevenueResponse.setSoldQuantity(item.getSoldQuantity());

            // Find the matching TypeOfProduct for the current item
            TypeOfProduct matchingProduct = typeOfProducts.stream()
                    .filter(abc -> abc.getId().equals(item.getTypeOfProductId()))
                    .findFirst()
                    .orElse(null);

            if (matchingProduct != null) {
                topRevenueResponse.setRevenue(item.getSoldQuantity() * matchingProduct.getPrice());
            } else {
                topRevenueResponse.setRevenue(0L); // Handle case where no matching product is found
            }

            topRevenueResponses.add(topRevenueResponse);
        }

        // Assuming SellerControlInfoResponse should hold these topRevenueResponses
        return topRevenueResponses;
    }

    public List<ProductDetailsResponse> findByCondition(FilterProductRequest filter) {
        System.out.println(filter.toString());
        List<Long> ids = productRepository.findByCondition(filter);

        if (!ObjectUtils.isEmpty(ids)) {
            List<Product> products = productRepository.findAllById(ids);
            List<ProductDetailsResponse> responses = handleProductToProductResponse(products);

            if (Objects.equals(filter.getSortField(), "countRates")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(ProductDetailsResponse::getCountRates));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getCountRates().compareTo(p1.getCountRates()));
                }
            }
           else if (Objects.equals(filter.getSortField(), "createdAt")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(ProductDetailsResponse::getCreatedAt));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
                }
            }else if (Objects.equals(filter.getSortField(), "soldQuantity")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(ProductDetailsResponse::getSoldQuantity));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getSoldQuantity().compareTo(p1.getSoldQuantity()));
                }
            }

            return responses;
        } else {
            return new ArrayList<>();
        }
    }

    public List<SuggestProductResponse> search(FilterProductRequest filter) {
        List<Long> ids = productRepository.findByCondition(filter);
        if (!ObjectUtils.isEmpty(ids)) {
            List<Product> products = productRepository.findAllById(ids);
            List<SuggestProductResponse> responses = handleProductToSuggestProductResponse(products);

            if (Objects.equals(filter.getSortField(), "countRates")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(SuggestProductResponse::getCountRates));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getCountRates().compareTo(p1.getCountRates()));
                }
            }
            else if (Objects.equals(filter.getSortField(), "createdAt")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(SuggestProductResponse::getCreatedAt));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
                }
            }else if (Objects.equals(filter.getSortField(), "soldQuantity")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(SuggestProductResponse::getSoldQuantity));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getSoldQuantity().compareTo(p1.getSoldQuantity()));
                }
            }else if (Objects.equals(filter.getSortField(), "price")) {
                if (filter.getTypeSort().equals("ASC")) {
                    responses.sort(Comparator.comparing(SuggestProductResponse::getPriceMin));
                } else if (filter.getTypeSort().equals("DESC")) {
                    responses.sort((p1, p2) -> p2.getPriceMin().compareTo(p1.getPriceMin()));
                }
            }

            return responses;
        } else {
            return new ArrayList<>();
        }
    }
    public List<SuggestProductResponse> handleProductToSuggestProductResponse(List<Product> products)
    {
        List<Product> products1 = productRepository.findAllActiveProducts();
        List<SuggestProductResponse> responses = new ArrayList<>();
        for (Product p: products)
        {
            SuggestProductResponse response = new SuggestProductResponse();
            response.setTotalAmount(products1.size());
            String url = "http://localhost:8020/file/get-info-images?objectId=" + p.getId() + "&objectName=ProductImage";
            List<FileInfoResponse> imageProducts = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<FileInfoResponse>>() {}
            ).getBody();
            response.setImage(imageProducts.get(0).getContent());
            response.setPid(p.getId());
            response.setName(p.getName());
            List<TypeOfProduct> tops = p.getTypesOfProducts();
            double totalRateStars = 0;
            int totalRatings = 0;
            long priceMax = Long.MIN_VALUE;
            long priceMin = Long.MAX_VALUE;
            long totalSoldQuantity = 0;

            for (TypeOfProduct product : tops) {
                List<Rate> rates = product.getRates();
                if (!rates.isEmpty()) {
                    // Tính tổng rateStar cho sản phẩm này
                    for (Rate rate : rates) {
                        totalRateStars += rate.getRateStar();
                    }
                    // Cộng số lượng đánh giá vào tổng số đánh giá
                    totalRatings += rates.size();
                }
                // Cập nhật giá trị priceMax
                if (product.getPrice() > priceMax) {
                    priceMax = product.getPrice();
                }

                // Cập nhật giá trị priceMin
                if (product.getPrice() < priceMin) {
                    priceMin = product.getPrice();
                }

                // Cộng dồn soldQuantity
                totalSoldQuantity += product.getSoldQuantity();
            }
            long price = tops.get(0).getPrice();
            long originalPrice = tops.get(0).getOriginalPrice();

            int reducePercent = (int) Math.round(100 - ((double) price / originalPrice) * 100);
            double averageRateStar = totalRatings == 0 ? 0 : totalRateStars / totalRatings;
            // Thiết lập giá trị cho response
            response.setPriceMax(priceMax);
            response.setPriceMin(priceMin);
            response.setCountRates((long) totalRatings);
            response.setCreatedAt(p.getCreatedAt());
            response.setSoldQuantity(totalSoldQuantity);
            response.setReducePercent(reducePercent);
            response.setRateStar(averageRateStar);
            responses.add(response);
        }
        return responses;
    }
    public List<SuggestProductResponse> suggestById(Long pid) {
        String url = "http://localhost:5000/similar-products?product_id=" + pid +"&number=5";
        List<Long> ids = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Long>>() {
                }
        ).getBody();
        List<Product> products = productRepository.findAllById(ids);
        return handleProductToSuggestProductResponse(products);
    }

    public List<SuggestProductResponse> suggestByUserId(Long userId) {
        String url = "http://localhost:5001/recommend?user_id=" + userId;

        // Tạo mảng rỗng để trả về nếu gọi URL không thành công
        List<Long> ids = new ArrayList<>();

        try {
            // Gọi HTTP request và nhận danh sách ids
            ids = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Long>>() {}
            ).getBody();
        } catch (Exception e) {
            // Log lỗi nếu có, ví dụ: System.out.println("Error calling the recommendation service");
            //e.printStackTrace();
            // Không có gì để xử lý thêm nếu gặp lỗi, ids sẽ là mảng rỗng
            return new ArrayList<>();
        }

        // Lấy sản phẩm từ repository nếu có ids
        List<Product> products = productRepository.findAllById(ids);
        return handleProductToSuggestProductResponse(products);
    }

}
