package com.anji.inventory.repository;

import com.anji.inventory.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySkuIgnoreCase(String sku);

    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR :keyword = '' OR
               LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:category IS NULL OR :category = '' OR p.category = :category)
        """)
    Page<Product> search(@Param("keyword") String keyword,
                          @Param("category") String category,
                          Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.quantity <= p.reorderLevel")
    List<Product> findLowStock();

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findDistinctCategories();
}
