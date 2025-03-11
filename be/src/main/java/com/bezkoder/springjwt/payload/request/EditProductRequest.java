package com.bezkoder.springjwt.payload.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EditProductRequest {
    public Long id;
    public String name;
    public String title1;
    public String title2;
    public Long sellerId;
    public Long categoryId;
    public Long supplierId;
    public String listTypeOfProduct;
    public List<MultipartFile> imageLabel1s;
    public List<MultipartFile> imageProducts;
    public MultipartFile description;
    public List<String> label1sDelete;
    public List<String> label2sDelete;
    public List<Long> listImageLabel1Del;
    public List<Long> listImageProductDel;
    public boolean changeTitleNum;
}

