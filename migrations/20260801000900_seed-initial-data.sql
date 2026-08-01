-- ============================================================
-- Seed Kategori Barang
-- Konteks: Gudang Koperasi Tani Mekar Jaya (Inventori Pertanian)
-- ============================================================
INSERT INTO public.categories (name, color) VALUES
  ('Benih & Bibit', '#16a34a'),
  ('Pupuk Organik', '#65a30d'),
  ('Pupuk Kimia', '#ea580c'),
  ('Pestisida', '#dc2626'),
  ('Obat-obatan Tanaman', '#e11d48'),
  ('Alat Pertanian', '#2563eb'),
  ('Mesin Pertanian', '#4f46e5'),
  ('Hasil Panen', '#ca8a04'),
  ('Pakan Ternak', '#92400e'),
  ('Sarana Irigasi', '#0891b2'),
  ('Karung & Kemasan', '#7c3aed'),
  ('Bahan Bakar & Pelumas', '#475569');

-- ============================================================
-- Seed Satuan Dasar (UOM)
-- ============================================================
INSERT INTO public.uoms (name, symbol) VALUES
  -- Satuan Berat
  ('Kilogram', 'kg'),
  ('Gram', 'g'),
  ('Ton', 'ton'),
  ('Kwintal', 'kw'),
  ('Ons', 'ons'),
  -- Satuan Volume
  ('Liter', 'L'),
  ('Mililiter', 'mL'),
  -- Satuan Kemasan
  ('Karung', 'krg'),
  ('Sak', 'sak'),
  ('Botol', 'btl'),
  ('Sachet', 'sct'),
  ('Jerigen', 'jrg'),
  ('Dos', 'dos'),
  ('Pack', 'pck'),
  ('Bungkus', 'bks'),
  ('Kaleng', 'klg'),
  -- Satuan Lainnya
  ('Unit', 'unit'),
  ('Batang', 'btg'),
  ('Lembar', 'lbr'),
  ('Meter', 'm'),
  ('Roll', 'roll'),
  ('Ikat', 'ikt'),
  ('Buah', 'bh');

-- ============================================================
-- Seed Konversi Satuan
-- ============================================================
-- Berat
INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'kg'),
       (SELECT id FROM public.uoms WHERE symbol = 'g'), 1000;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'g'),
       (SELECT id FROM public.uoms WHERE symbol = 'kg'), 0.001;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'ton'),
       (SELECT id FROM public.uoms WHERE symbol = 'kg'), 1000;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'kg'),
       (SELECT id FROM public.uoms WHERE symbol = 'ton'), 0.001;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'kw'),
       (SELECT id FROM public.uoms WHERE symbol = 'kg'), 100;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'kg'),
       (SELECT id FROM public.uoms WHERE symbol = 'kw'), 0.01;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'ons'),
       (SELECT id FROM public.uoms WHERE symbol = 'g'), 100;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'g'),
       (SELECT id FROM public.uoms WHERE symbol = 'ons'), 0.01;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'ton'),
       (SELECT id FROM public.uoms WHERE symbol = 'kw'), 10;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'kw'),
       (SELECT id FROM public.uoms WHERE symbol = 'ton'), 0.1;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'kg'),
       (SELECT id FROM public.uoms WHERE symbol = 'ons'), 10;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'ons'),
       (SELECT id FROM public.uoms WHERE symbol = 'kg'), 0.1;

-- Volume
INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'L'),
       (SELECT id FROM public.uoms WHERE symbol = 'mL'), 1000;

INSERT INTO public.uom_conversions (from_uom_id, to_uom_id, factor)
SELECT (SELECT id FROM public.uoms WHERE symbol = 'mL'),
       (SELECT id FROM public.uoms WHERE symbol = 'L'), 0.001;
