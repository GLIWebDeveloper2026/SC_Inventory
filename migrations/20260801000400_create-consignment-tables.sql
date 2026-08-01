CREATE TABLE public.consignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_code TEXT NOT NULL UNIQUE,
  owner_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.consignment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_id UUID NOT NULL REFERENCES public.consignments(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  received_qty NUMERIC NOT NULL DEFAULT 0,
  uom_id UUID REFERENCES public.uoms(id),
  sold_qty NUMERIC NOT NULL DEFAULT 0,
  remaining_qty NUMERIC GENERATED ALWAYS AS (received_qty - sold_qty) STORED
);
