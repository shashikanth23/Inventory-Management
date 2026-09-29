package com.anji.inventory.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be under 120 characters")
    private String name;

    @Size(max = 40, message = "SKU must be under 40 characters")
    private String sku;

    @Size(max = 60, message = "Category must be under 60 characters")
    private String category;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private Double price;

    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;
}
