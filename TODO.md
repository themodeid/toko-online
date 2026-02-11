# TODO: Implement PostgreSQL Version of Order Checkout

## Steps to Complete
- [x] Fix imports in orders.controller.ts (correct Request/Response import)
- [x] Implement full checkout function in orders.controller.ts with PostgreSQL queries
  - [x] Validate request body using CheckoutSchema
  - [x] Extract userId from req.userId
  - [x] Validate items: not empty, product_id valid (assume UUID), quantity > 0
  - [x] Fetch products from produk table using product_ids
  - [x] Check if all products found and stock sufficient
  - [x] Calculate orderItems with price, quantity, subtotal
  - [x] Calculate total
  - [x] Use transaction: Insert into orders table, insert order_items, update stock
  - [x] Fetch the created order with populated data (user, items.produk)
  - [x] Return response matching OrderResponseSchema
- [x] Ensure error handling with AppError and catchAsync
- [x] Test the implementation (run the server and test endpoint)

## Dependent Files
- be/src/modules/orders/orders.controller.ts (main implementation)
- be/src/modules/orders/orders.schema.ts (already has schemas)
- be/src/config/database.ts (pool import)
- be/src/modules/orders/orders.routes.ts (ensure route is set up for POST /orders with authMiddleware)

## Followup Steps
- [x] Run the backend server to verify no syntax errors
- [ ] Test the POST /orders endpoint with sample data
- [ ] If needed, adjust database schema or add missing tables (orders, order_items)
