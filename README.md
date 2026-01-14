# CatchaFire Order Management System

A comprehensive full-stack application for capturing customer orders, validating delivery locations, and updating CSV files in real-time for 3rd party delivery integration.

## Tech Stack

- **Backend**: FastAPI, Pydantic, PostgreSQL, pandas (CSV processing)
- **Frontend**: React Native with Expo, GPS location services
- **Database**: PostgreSQL for order storage
- **File Storage**: CSV files for 3rd party delivery integration

## Current Implementation (Tasks 1 & 2)

### ✅ Task 1: Order Capture & CSV Updates

- **Order Creation**: Users create orders through React Native form
- **Auto-generated Order IDs**: Backend assigns unique sequential order IDs
- **Dual Storage**: Orders saved to PostgreSQL database AND CSV file simultaneously
- **Database Fallback**: If database unavailable, gracefully falls back to CSV-only operation
- **Real-time CSV Updates**: CSV file updated immediately for 3rd party delivery
- **Pydantic Validation**: Type-safe order data validation
- **Order Confirmation**: Detailed popup showing order summary and storage status

### ✅ Task 2: Delivery Location Validation

- **GPS Location Check**: Validates delivery eligibility based on distance from market
- **South Africa Ready**: Configured for Johannesburg CBD coordinates (-26.2041° S, 28.0473° E)
- **10-Mile Radius**: Alerts if delivery location exceeds 10 miles from market
- **Integrated Flow**: Location validation required before order creation
- **Permission Handling**: Proper location permission requests

### CSV Structure

```csv
order_id,customer_id,product_name,quantity,total_price,order_time
1,1,Fresh Apples,5,25.0,2025-01-14T10:00:00
2,1,Organic Bananas,3,15.75,2025-01-14T11:00:00
```

### Database Schema

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

### CSV Structure

```csv
order_id,customer_id,product_name,quantity,total_price,order_time
1,1,Fresh Apples,5,25.0,2025-01-14T10:00:00
2,1,Organic Bananas,3,15.75,2025-01-14T11:00:00
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
│   ├── App.js               # Main React Native app
│   ├── contexts/            # React contexts for state management
│   ├── hooks/               # Custom React hooks
│   └── package.json         # Node dependencies
└── README.md
```

## Documentation

- **[Code Citations](CODE_CITATIONS.md)** - Implementation references
- **[DoorDash Integration Setup](DoorDash-Integration-Setup.md)** - Future API integration guide
- **[Modal Implementation Guide](Modal-Implementation-Guide.md)** - UI component documentation
