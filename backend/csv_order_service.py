"""
CSV Order service module for Task 1 - handling order creation and CSV file updates
"""
import pandas as pd
import os
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from models import CSVOrder

logger = logging.getLogger(__name__)

class CSVOrderService:
    """Handles order creation, database storage, and CSV file updates for Task 1"""

    def __init__(self):
        # Use the correct CSV file for Task 1
        self.csv_file_path = 'doordash_bulk_orders.csv'
        self.orders: List[Dict[str, Any]] = []  # In-memory storage for orders

    def create_csv_order(self, order: CSVOrder, db: Optional[Any] = None) -> Dict[str, Any]:
        """
        Create a new order and save to CSV file

        Args:
            order: CSVOrder data with required fields
            db: Database session (optional, ignored in CSV-only mode)

        Returns:
            Order creation response
        """
        try:
            # Generate order_id if not provided
            order_id = order.order_id if order.order_id is not None else self._get_next_order_id()

            # Prepare order data for CSV
            order_data: Dict[str, Any] = {
                'order_id': order_id,
                'customer_id': order.customer_id,
                'product_name': order.product_name,
                'quantity': order.quantity,
                'total_price': order.total_price,
                'order_time': order.order_time.isoformat() if hasattr(order.order_time, 'isoformat') else str(order.order_time)
            }

            # Add to in-memory storage
            self.orders.append(order_data)

            # Save to CSV file
            self._save_to_csv(order_data)

            logger.info(f"Order saved to CSV with ID: {order_id}")

            return {
                "message": "Order created successfully",
                "order_id": order_id,
                "csv_saved": True,
                "fallback_mode": False
            }

        except Exception as e:
            logger.error(f"CSV Order creation error: {e}")
            return {"error": f"Failed to create CSV order: {str(e)}"}

    def _get_next_order_id(self) -> int:
        """Get the next order ID"""
        if not self.orders:
            return 1

        # Extract numeric order IDs, handling both strings and integers
        numeric_ids: List[int] = []
        for order in self.orders:
            order_id = order['order_id']
            if isinstance(order_id, str):
                # Try to extract numeric part from string (e.g., "TEST-001" -> 1)
                try:
                    # Split on common separators and take the last numeric part
                    parts = order_id.replace('-', ' ').replace('_', ' ').split()
                    for part in reversed(parts):
                        if part.isdigit():
                            numeric_ids.append(int(part))
                            break
                except (ValueError, AttributeError):
                    continue
            elif isinstance(order_id, (int, float)):
                numeric_ids.append(int(order_id))

        if numeric_ids:
            return max(numeric_ids) + 1
        else:
            return 1

    def _save_to_csv(self, order_data: Dict[str, Any]):
        """
        Save order data to CSV file

        Args:
            order_data: The order data dictionary
        """
        try:
            df = pd.DataFrame([order_data])

            # Check if CSV file exists
            if not os.path.exists(self.csv_file_path):
                # Create new CSV file with headers
                df.to_csv(self.csv_file_path, index=False)
                logger.info(f"Created new CSV file: {self.csv_file_path}")
            else:
                # Append to existing CSV file
                df.to_csv(self.csv_file_path, mode='a', header=False, index=False)
                logger.info(f"Appended order to CSV file: {self.csv_file_path}")

        except Exception as e:
            logger.error(f"Error saving to CSV: {e}")
            raise

    def _update_csv_file(self, order_dict: Dict[str, Any]):
        """
        Update the task1_orders.csv file with the new order using Task 1 format

        Args:
            order_dict: The order data dictionary
        """
        # Prepare the order data for CSV - single item format only (no JSON items column)
        items = order_dict.get('items', [])

        # Use single item format (first item if multiple exist)
        if items and len(items) > 0:
            # Use first item for single-item CSV format
            first_item = items[0]
            csv_data: Dict[str, Any] = {
                'order_id': order_dict['order_id'],
                'customer_id': order_dict['customer_id'],
                'product_name': first_item['product_name'],
                'quantity': first_item['quantity'],
                'total_price': order_dict['total_price'],
                'order_time': order_dict['order_time'].isoformat() if isinstance(order_dict['order_time'], datetime) else order_dict['order_time']
            }
        else:
            # Legacy single item format
            csv_data: Dict[str, Any] = {
                'order_id': order_dict['order_id'],
                'customer_id': order_dict['customer_id'],
                'product_name': order_dict.get('product_name', 'Unknown Product'),
                'quantity': order_dict.get('quantity', 1),
                'total_price': order_dict['total_price'],
                'order_time': order_dict['order_time'].isoformat() if isinstance(order_dict['order_time'], datetime) else order_dict['order_time']
            }

        # Add delivery address fields if available
        delivery_address = order_dict.get('delivery_address', {})
        if delivery_address:
            csv_data.update({
                'delivery_street': delivery_address.get('street', ''),
                'delivery_apartment': delivery_address.get('apartment', ''),
                'delivery_city': delivery_address.get('city', ''),
                'delivery_state': delivery_address.get('state', ''),
                'delivery_zip': delivery_address.get('zipCode', ''),
                'delivery_country': delivery_address.get('country', '')
            })
        else:
            # Add empty delivery fields for consistency
            csv_data.update({
                'delivery_street': '',
                'delivery_apartment': '',
                'delivery_city': '',
                'delivery_state': '',
                'delivery_zip': '',
                'delivery_country': ''
            })

        # For CSV output, only include the original columns
        csv_output_data: Dict[str, Any] = {
            'order_id': csv_data['order_id'],
            'customer_id': csv_data['customer_id'],
            'product_name': csv_data['product_name'],
            'quantity': csv_data['quantity'],
            'total_price': csv_data['total_price'],
            'order_time': csv_data['order_time']
        }

        # TODO: Uncomment below for multiple items support (adds items JSON column)
        # import json
        # if items and len(items) > 1:
        #     # For multiple items, add items column with JSON data
        #     csv_data['items'] = json.dumps([item.model_dump() if hasattr(item, 'model_dump') else item for item in items])
        #     csv_data['product_name'] = f"Multiple Items ({len(items)})"
        #     csv_data['quantity'] = sum(item['quantity'] for item in items)

        # Create DataFrame with single row (only original columns for CSV)
        df = pd.DataFrame([csv_output_data])

        # Check if CSV file exists
        if not os.path.exists(self.csv_file_path):
            # Create new CSV file with headers
            df.to_csv(self.csv_file_path, index=False)
            logger.info(f"Created new Task 1 CSV file: {self.csv_file_path}")
        else:
            # Read existing CSV to check current columns
            existing_df = pd.read_csv(self.csv_file_path)  # type: ignore
            existing_columns = set(existing_df.columns)
            new_columns = set(df.columns)
            
            if new_columns != existing_columns:
                # Schema has changed - recreate CSV with all columns
                # Load all existing orders and add new columns
                all_orders: List[Dict[str, Any]] = []
                for order in self.orders[:-1]:  # All orders except the current one
                    order_copy = order.copy()
                    # Add missing delivery columns if they don't exist (for internal storage)
                    for col in ['delivery_street', 'delivery_apartment', 'delivery_city', 
                               'delivery_state', 'delivery_zip', 'delivery_country']:
                        if col not in order_copy:
                            order_copy[col] = ''
                    all_orders.append(order_copy)
                
                # Add the current order
                all_orders.append(csv_data)
                
                # Create CSV output data for all orders (only original columns)
                csv_orders: List[Dict[str, Any]] = []
                for order in all_orders:
                    csv_order: Dict[str, Any] = {
                        'order_id': order['order_id'],
                        'customer_id': order['customer_id'],
                        'product_name': order['product_name'],
                        'quantity': order['quantity'],
                        'total_price': order['total_price'],
                        'order_time': order['order_time']
                    }
                    csv_orders.append(csv_order)
                
                # Recreate CSV with all orders and original schema only
                complete_df = pd.DataFrame(csv_orders)
                complete_df.to_csv(self.csv_file_path, index=False)
                logger.info(f"Recreated Task 1 CSV file with original schema: {self.csv_file_path}")
            else:
                # Append to existing CSV file without headers
                df.to_csv(self.csv_file_path, mode='a', header=False, index=False)
                logger.info(f"Appended order {csv_data['order_id']} to Task 1 CSV file: {self.csv_file_path}")

    def get_all_csv_orders(self) -> List[Dict[str, Any]]:
        """Get all CSV orders"""
        return self.orders.copy()

    def load_existing_orders(self):
        """Load existing orders from CSV file if it exists"""
        if os.path.exists(self.csv_file_path):
            try:
                df = pd.read_csv(self.csv_file_path)  # type: ignore
                # Convert to list of dicts
                self.orders = df.to_dict('records')  # type: ignore
                # Convert order_time strings back to datetime objects
                for order in self.orders:
                    if 'order_time' in order and order['order_time']:
                        try:
                            order['order_time'] = datetime.fromisoformat(order['order_time'])
                        except:
                            pass  # Keep as string if parsing fails
                logger.info(f"Loaded {len(self.orders)} existing orders from CSV")
            except Exception as e:
                logger.error(f"Error loading existing orders from CSV: {e}")
                self.orders = []

# Global CSV order service instance
csv_order_service = CSVOrderService()
# Load existing orders on startup
csv_order_service.load_existing_orders()