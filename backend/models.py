"""
Pydantic models for Task 1 - CSV Order Management
"""
from pydantic import BaseModel, field_validator, model_validator
from datetime import datetime
from typing import Optional, List, Dict, Any

# Item model for individual products in an order
class OrderItem(BaseModel):
    product_name: str = "Unknown Product"
    quantity: int = 1
    unit_price: float = 10.00

    @field_validator('product_name')
    @classmethod
    def validate_product_name(cls, v: str) -> str:
        """Ensure product_name is not empty, use default if empty"""
        if not v or v.strip() == "":
            return "Unknown Product"
        return v.strip()

# CSV Order model supporting both single item (legacy) and multiple items
class CSVOrder(BaseModel):
    order_id: Optional[int] = None  # Optional, will be auto-generated if not provided
    customer_id: int
    # Legacy fields for backward compatibility
    product_name: Optional[str] = None
    quantity: Optional[int] = None
    # New multi-item structure
    items: List[OrderItem] = []
    total_price: float = 0.0  # Calculated total
    order_time: datetime
    delivery_address: Optional[Dict[str, Any]] = None  # Delivery address information

    @model_validator(mode='after')
    def handle_legacy_format(self):
        """Convert legacy single-item format to new multi-item format"""
        if self.product_name and not self.items:
            # Convert legacy format to items
            unit_price = 10.00  # Default, will be overridden in service
            if self.quantity and self.quantity > 0:
                unit_price = self.total_price / self.quantity if self.total_price > 0 else 10.00

            self.items = [OrderItem(
                product_name=self.product_name,
                quantity=self.quantity or 1,
                unit_price=unit_price
            )]
        elif not self.items:
            # Ensure at least one item
            self.items = [OrderItem()]

        # Recalculate total_price from items
        self.total_price = sum(item.quantity * item.unit_price for item in self.items)
        return self