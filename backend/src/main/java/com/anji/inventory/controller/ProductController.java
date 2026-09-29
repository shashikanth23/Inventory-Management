package com.anji.inventory.controller;

import com.anji.inventory.dto.DashboardStats;
import com.anji.inventory.dto.ProductRequest;
import com.anji.inventory.dto.ProductResponse;
import com.anji.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<ProductResponse> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return productService.search(keyword, category, pageable);
    }

    @GetMapping("/{id}")
    public ProductResponse getOne(@PathVariable Long id) {
        return productService.getById(id);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return productService.getCategories();
    }

    @GetMapping("/dashboard")
    public DashboardStats dashboard() {
        return productService.getDashboardStats();
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
