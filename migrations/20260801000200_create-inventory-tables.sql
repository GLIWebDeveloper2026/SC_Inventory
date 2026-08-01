-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Units of Measure
CREATE TABLE public.uoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Items (Master Barang)
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  base_uom_id UUID REFERENCES public.uoms(id),
  stock NUMERIC NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock NUMERIC NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- UOM Conversions (after items so we can FK to items)
CREATE TABLE public.uom_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_uom_id UUID NOT NULL REFERENCES public.uoms(id),
  to_uom_id UUID NOT NULL REFERENCES public.uoms(id),
  factor NUMERIC NOT NULL CHECK (factor > 0),
  item_id UUID REFERENCES public.items(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
