package com.anji.inventory.service;

import com.anji.inventory.dto.DashboardStats;
import com.anji.inventory.dto.ProductRequest;
import com.anji.inventory.dto.ProductResponse;
import com.anji.inventory.entity.Product;
import com.anji.inventory.exception.DuplicateSkuException;
import com.anji.inventory.exception.ResourceNotFoundException;
import com.anji.inventory.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String keyword, String category, Pageable pageable) {
        return repository.search(keyword, category, pageable).map(ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return ProductResponse.from(findEntity(id));
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return repository.findDistinctCategories();
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (request.getSku() != null && !request.getSku().isBlank()
                && repository.existsBySkuIgnoreCase(request.getSku())) {
            throw new DuplicateSkuException("A product with SKU '" + request.getSku() + "' already exists");
        }

        Product product = new Product();
        applyRequest(product, request);
        return ProductResponse.from(repository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findEntity(id);

        if (request.getSku() != null && !request.getSku().isBlank()
                && !request.getSku().equalsIgnoreCase(product.getSku())
                && repository.existsBySkuIgnoreCase(request.getSku())) {
            throw new DuplicateSkuException("A product with SKU '" + request.getSku() + "' already exists");
        }

        applyRequest(product, request);
        return ProductResponse.from(repository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        List<Product> all = repository.findAll();

        long totalProducts = all.size();
        long totalUnits = all.stream().mapToLong(Product::getQuantity).sum();
        double totalValue = all.stream().mapToDouble(p -> p.getQuantity() * p.getPrice()).sum();

        List<Product> lowStock = repository.findLowStock();

        Map<String, Long> byCategory = all.stream()
                .collect(Collectors.groupingBy(
                        p -> (p.getCategory() == null || p.getCategory().isBlank()) ? "Uncategorized" : p.getCategory(),
                        Collectors.counting()));

        List<ProductResponse> lowStockResponses = lowStock.stream()
                .map(ProductResponse::from)
                .toList();

        return new DashboardStats(
                totalProducts,
                totalUnits,
                totalValue,
                lowStock.size(),
                byCategory.size(),
                byCategory,
                lowStockResponses
        );
    }

    private Product findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.getName().trim());
        product.setSku(request.getSku() == null ? null : request.getSku().trim());
        product.setCategory(request.getCategory() == null ? null : request.getCategory().trim());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());
        product.setReorderLevel(request.getReorderLevel() == null ? 5 : request.getReorderLevel());
    }
}
