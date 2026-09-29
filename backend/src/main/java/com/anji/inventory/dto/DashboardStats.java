package com.anji.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class DashboardStats {
    private long totalProducts;
    private long totalUnits;
    private double totalInventoryValue;
    private long lowStockCount;
    private long categoryCount;
    private Map<String, Long> productsByCategory;
    private List<ProductResponse> lowStockItems;
}
