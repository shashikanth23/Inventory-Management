package com.anji.inventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(unique = true, length = 40)
    private String sku;

    @Column(length = 60)
    private String category;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(nullable = false)
    private Double price = 0.0;

    /** Quantity at or below this level is flagged as low stock. */
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 5;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isLowStock() {
        return quantity != null && reorderLevel != null && quantity <= reorderLevel;
    }
}
