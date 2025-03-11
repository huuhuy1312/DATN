package com.example.product_service.controller;

import com.example.product_service.dto.request.AddCategoryRequest;
import com.example.product_service.dto.request.FilterCategory;
import com.example.product_service.dto.request.UpdateCategoryRequest;
import com.example.product_service.dto.response.CategoryAndChildResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.repository.CategoryRepository;
import com.example.product_service.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Filter;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    @Autowired
    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;
    @PostMapping("find-category-parent-by-name")
    public ResponseEntity<?> getAllParentCategories(@RequestParam(name = "name") String name) {
        return ResponseEntity.ok(categoryService.findByName(name));
    }
    @GetMapping("/find-by-id-parent")
    public ResponseEntity<?> findByIdParent(@RequestParam(name = "id") Long id) {
        return ResponseEntity.ok(categoryService.findByIdParent(id));
    }


    @GetMapping("/all-child")
    public ResponseEntity<?> getAllChildCategories() {
        return ResponseEntity.ok(categoryRepository.findChildCategories());
    }
    private CategoryAndChildResponse buildCategoryTree(Category category) {
        CategoryAndChildResponse response = new CategoryAndChildResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        if (category.getSubcategories() != null && !category.getSubcategories().isEmpty()) {
            List<CategoryAndChildResponse> childResponses = new ArrayList<>();
            for (Category child : category.getSubcategories()) {
                childResponses.add(buildCategoryTree(child));
            }
            response.setChilds(childResponses);
        } else {
            response.setChilds(new ArrayList<>()); // Không có con
        }

        return response;
    }
    @GetMapping("/all-category-and-child")
    public ResponseEntity<List<CategoryAndChildResponse>> allCategoryAndChild() {
        // Lấy danh sách tất cả các danh mục cha
        List<Category> parentCategories = categoryRepository.findParentCategories();

        // Xây dựng danh sách response
        List<CategoryAndChildResponse> responseList = new ArrayList<>();
        for (Category parent : parentCategories) {
            // Gọi hàm đệ quy để xây dựng cây danh mục
            CategoryAndChildResponse response = buildCategoryTree(parent);
            responseList.add(response);
        }

        return ResponseEntity.ok(responseList);
    }
    @PostMapping("/add")
    public ResponseEntity<String> addCategory(@RequestBody AddCategoryRequest request)
    {
        Category category = new Category();
        category.setName(request.name);
        if(!ObjectUtils.isEmpty(request.idParent)){
            Category parent = categoryRepository.findById(request.getIdParent()).get();
            category.setCategoryParent(parent);
        }
        categoryRepository.save(category);
        return ResponseEntity.ok("Thêm category thành công");
    }
    @PostMapping("/edit")
    public ResponseEntity<String> addCategory(@RequestBody UpdateCategoryRequest request)
    {
        Category category = categoryRepository.findById(request.id).get();
        category.setName(request.name);
        categoryRepository.save(category);
        return ResponseEntity.ok("Update category thành công");
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCategory(@RequestParam("id") Long id)
    {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok("Xóa category thành công");

    }
//    @PostMapping("/add")
//    public ResponseEntity<?> addCategory(@RequestParam String nameCategory) {
//
//        if (categoryRepository.existsByName(nameCategory)) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category already exists");
//        } else {
//            Category category = new Category();
//            category.setName(nameCategory);
//            categoryRepository.save(category);
//            return ResponseEntity.status(HttpStatus.CREATED).body("Category added successfully");
//        }
//    }
//
//    @DeleteMapping("/all")
//    public void deleteAllCategories()
//    {
//        categoryRepository.deleteAll();
//    }
}

