"""
Task 1 - Order Management API with CSV Storage
FastAPI application for capturing customer orders and updating CSV files in real-time
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import CSVOrder
from csv_order_service import csv_order_service
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Task 1 - CSV Order Management API",
    description="API for capturing customer orders and updating CSV files in real-time",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Task 1 - Order endpoints
@app.post("/orders/")
def create_order(order: CSVOrder):
    """
    Create a new order and update CSV file

    - **order**: Order data with required fields: customer_id, product_name, quantity, total_price, order_time
    - Returns order creation confirmation with CSV update status
    """
    try:
        return csv_order_service.create_csv_order(order, None)
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        return {"error": f"Failed to create order: {str(e)}"}

# Keep CSV endpoints for backward compatibility
@app.post("/csv-orders/")
def create_csv_order(csv_order: CSVOrder):
    """
    Create a new CSV order

    - **csv_order**: CSV Order data with required fields: order_id, customer_id, product_name, quantity, total_price, order_time
    - Returns order creation confirmation and CSV update status
    """
    try:
        return csv_order_service.create_csv_order(csv_order, None)
    except Exception as e:
        logger.error(f"Error creating CSV order: {e}")
        return {"error": f"Failed to create CSV order: {str(e)}"}

@app.get("/orders/")
def get_orders():
    """
    Get all orders from CSV data
    """
    try:
        return csv_order_service.get_all_csv_orders()
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        return {"error": f"Failed to fetch orders: {str(e)}"}

# Keep CSV endpoints for backward compatibility
@app.get("/csv-orders/")
def get_csv_orders():
    """
    Get all CSV orders from the CSV file
    """
    try:
        return csv_order_service.get_all_csv_orders()
    except Exception as e:
        logger.error(f"Error fetching CSV orders: {e}")
        return {"error": f"Failed to fetch CSV orders: {str(e)}"}

@app.get("/")
def root() -> Dict[str, Any]:
    """
    Root endpoint - API information
    """
    return {
        "message": "Task 1 - CSV Order Management API",
        "endpoints": {
            "POST /csv-orders/": "Create a new CSV order",
            "GET /csv-orders/": "Get all CSV orders"
        },
        "csv_columns": ["order_id", "customer_id", "product_name", "quantity", "total_price", "order_time"]
    }