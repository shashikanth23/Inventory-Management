package com.anji.inventory.dto;

import com.anji.inventory.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private Integer quantity;
    private Double price;
    private Integer reorderLevel;
    private boolean lowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getSku(),
                p.getCategory(),
                p.getQuantity(),
                p.getPrice(),
                p.getReorderLevel(),
                p.isLowStock(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
