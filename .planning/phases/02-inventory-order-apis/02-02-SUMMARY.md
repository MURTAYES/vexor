# Plan 02-02 Summary: Order Model

## Output Created
- `src/models/Order.js` — Order Mongoose schema.

## Execution Details
The schema embeds line item snapshots directly (snapshotting the price and metadata). A `pre('save')` hook utilizes an atomic `Counter` model to generate sequential, daily invoice numbers formatted as `VX-YYYYMMDD-NNN`.
