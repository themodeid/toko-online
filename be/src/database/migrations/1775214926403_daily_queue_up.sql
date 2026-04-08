-- Write your UP migration here
CREATE TABLE IF NOT EXISTS daily_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    queue_number INTEGER NOT NULL,
    queue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_daily_queue_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);