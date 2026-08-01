CREATE TABLE public.stock_opnames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opname_code TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  auditor_id UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.stock_opname_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_opname_id UUID NOT NULL REFERENCES public.stock_opnames(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  system_qty NUMERIC NOT NULL DEFAULT 0,
  physical_qty NUMERIC NOT NULL DEFAULT 0,
  diff NUMERIC GENERATED ALWAYS AS (physical_qty - system_qty) STORED,
  reason TEXT
);
