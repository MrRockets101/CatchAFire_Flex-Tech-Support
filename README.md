# CatchaFire Flex-Tech Support

## Proof of Concept

### 1. Capture Customer Orders and Update CSV File in Real Time

**Description:**
Let `order_id`, `customer_id`, `product_name`, `quantity`, `total_price`, `order_time` be the columns of the CSV file. Create a simple PostgreSQL table with the above mentioned fields and add values manually. Validate the schema of the model - order using Pydantic and using FastAPI create a POST operation to create the order into the CSV file. Create a React Native function for the API call. Update the code in the GitHub with separated modules for frontend and backend.

**Implementation:**
- **Backend**: FastAPI with Pydantic validation for order schema
- **Database**: PostgreSQL table with specified columns
- **CSV Integration**: Real-time updates to `doordash_bulk_orders.csv`
- **Frontend**: React Native app with API integration
- **Modular Architecture**: Separated frontend and backend modules

### 2. Delivery Location Validation (10-Mile Radius)

**Description:**
Based on the delivery location, if it is greater than 10 miles from the market, show a popup to alert the customer that "Delivery can't be processed for the requested location as it is greater than 10 miles from the market."

Create a React Native page with Expo as the backend to the UI aligned to the below image. If the user's selected location is greater than 10 miles from the market, prevent order processing and display the alert.

**Note:** DoorDash is not sharing the API with external organizations. They provide an option called "bulk order" and a table exists with columns such as product, quantity, delivery location and phone number. We need to update that CSV file in an automated fashion at specific intervals.

**UI Reference:**
![Delivery Address Modal](frontend/assets/Add-Delivery-Address-Modal-example.png)

## Tech Stack

- **Backend**: FastAPI, Pydantic, PostgreSQL, pandas (CSV processing)
- **Frontend**: React Native with Expo, GPS location services
- **Database**: PostgreSQL for order storage
- **File Storage**: CSV files for 3rd party delivery integration

## Features

### ✅ Order Management
- Order creation with validation
- Auto-generated sequential order IDs
- Dual storage (Database + CSV)
- Database fallback to CSV-only operation
- Real-time CSV updates for 3rd party delivery

### ✅ Location-Based Delivery Validation
- GPS location checking
- 10-mile radius validation from Johannesburg CBD
- Integrated delivery address modal
- Permission handling for location access

## CSV Structure

```csv
order_id,customer_id,product_name,quantity,total_price,order_time
1,1,Fresh Apples,5,25.0,2025-01-14T10:00:00
2,1,Organic Bananas,3,15.75,2025-01-14T11:00:00
```

## Database Schema

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    order_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup

### Backend Setup

1. **Install Python Dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL Database**:

   ```bash
   # Create database
   createdb orders_db

   # Or use your preferred PostgreSQL setup
   # Update DATABASE_URL in environment or database.py if needed
   ```

3. **Database Migration**:

   ```bash
   cd backend
   python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
   ```

4. **Start the Backend Server**:

   ```bash
   cd backend
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **API Endpoints**:
   - `GET /` - API information and available endpoints
   - `POST /orders/` - Create new order (database + CSV)
   - `GET /orders/` - Retrieve all orders from database
   - `POST /csv-orders/` - Create CSV order (backward compatibility)
   - `GET /csv-orders/` - Retrieve CSV orders from file

### Frontend Setup

1. **Install Dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Start Expo Development Server**:

   ```bash
   cd frontend
   npm start
   ```

3. **Run on Device/Simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Usage

### Creating Orders

1. **Grant Location Permission**: App requests location access for delivery validation
2. **Fill Order Details**:
   - **Product Name**: Name of the item
   - **Quantity**: Number of items
   - **Total Price**: Total cost
3. **Location Validation**: App checks if delivery location is within 10 miles of Johannesburg CBD
4. **Order Creation**: If location valid, order is created and saved to database + CSV
5. **Confirmation**: Detailed popup shows order summary

### Location Requirements

- **Market Location**: Johannesburg CBD (-26.2041° S, 28.0473° E)
- **Delivery Radius**: 10 miles maximum
- **Alert Message**: "Delivery can't be processed for the requested location as it is greater than 10 miles from the market."

### CSV File Location

- **File**: `backend/doordash_bulk_orders.csv`
- **Auto-created**: File is created automatically on first order
- **Append Mode**: New orders are appended without overwriting existing data

## API Examples

### Create Order

```bash
curl -X POST "http://localhost:8000/orders/" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "product_name": "Fresh Apples",
    "quantity": 5,
    "total_price": 25.00,
    "order_time": "2025-01-14T10:00:00"
  }'
```

### Get All Orders

```bash
curl "http://localhost:8000/orders/"
```

## Future Enhancements

- User authentication and dynamic customer IDs
- DoorDash API integration
- Order status tracking
- Delivery location validation
- Currency conversion features
- Bulk order processing

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic data models
│   ├── csv_order_service.py # CSV file operations
│   ├── requirements.txt     # Python dependencies
│   └── doordash_bulk_orders.csv # Order data storage
├── frontend/
│   ├── App.js               # Main React Native app (modular)
│   ├── components/          # Reusable UI components
│   │   ├── CurrencyModal.js
│   │   ├── DeliveryModal.js
│   │   ├── DeliveryConfirmationModal.js
│   │   └── OrderForm.js
│   ├── contexts/            # React contexts for state management
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── package.json         # Node dependencies
├── .github/                 # GitHub configuration
├── .vscode/                 # VS Code settings
└── README.md
```

## Documentation

- **[Code Citations](CODE_CITATIONS.md)** - Implementation references
- **[DoorDash Integration Setup](DoorDash-Integration-Setup.md)** - Future API integration guide
- **[Modal Implementation Guide](Modal-Implementation-Guide.md)** - UI component documentation
