-- Helper function to get user role (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT r.name FROM public.roles r
  INNER JOIN public.users u ON u.role_id = r.id
  WHERE u.id = (SELECT auth.uid())
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp;

-- Helper to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'Administrator'
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp;

-- Helper to check if user is warehouse staff (Admin Gudang, Kepala Gudang, or Administrator)
CREATE OR REPLACE FUNCTION public.is_warehouse_staff()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('Administrator', 'Kepala Gudang', 'Admin Gudang')
$$ LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp;

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uom_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_opnames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_opname_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- roles table
CREATE POLICY "Select roles all authenticated" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert roles administrator" ON public.roles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Update roles administrator" ON public.roles FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Delete roles administrator" ON public.roles FOR DELETE TO authenticated USING (public.is_admin());

-- users table
CREATE POLICY "Select users all authenticated" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert users administrator" ON public.users FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Update users administrator" ON public.users FOR UPDATE TO authenticated USING (public.is_admin() OR id = (SELECT auth.uid()));
CREATE POLICY "Delete users administrator" ON public.users FOR DELETE TO authenticated USING (public.is_admin());

-- categories table
CREATE POLICY "Select categories all authenticated" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert categories warehouse staff" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update categories warehouse staff" ON public.categories FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete categories warehouse staff" ON public.categories FOR DELETE TO authenticated USING (public.is_warehouse_staff());

-- uoms table
CREATE POLICY "Select uoms all authenticated" ON public.uoms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert uoms admin and kepala" ON public.uoms FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));
CREATE POLICY "Update uoms admin and kepala" ON public.uoms FOR UPDATE TO authenticated USING (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));
CREATE POLICY "Delete uoms admin and kepala" ON public.uoms FOR DELETE TO authenticated USING (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));

-- uom_conversions table
CREATE POLICY "Select uom_conversions all authenticated" ON public.uom_conversions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert uom_conversions admin and kepala" ON public.uom_conversions FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));
CREATE POLICY "Update uom_conversions admin and kepala" ON public.uom_conversions FOR UPDATE TO authenticated USING (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));
CREATE POLICY "Delete uom_conversions admin and kepala" ON public.uom_conversions FOR DELETE TO authenticated USING (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));

-- items table
CREATE POLICY "Select items all authenticated" ON public.items FOR SELECT TO authenticated USING (is_deleted = false OR public.is_admin());
CREATE POLICY "Insert items warehouse staff" ON public.items FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update items warehouse staff" ON public.items FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete items admin and kepala" ON public.items FOR DELETE TO authenticated USING (public.get_user_role() IN ('Administrator', 'Kepala Gudang'));

-- receipts
CREATE POLICY "Select receipts all authenticated" ON public.receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert receipts warehouse staff" ON public.receipts FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update receipts warehouse staff" ON public.receipts FOR UPDATE TO authenticated USING (public.is_warehouse_staff() AND (status = 'draft' OR public.get_user_role() IN ('Administrator', 'Kepala Gudang')));
CREATE POLICY "Delete receipts admin only draft" ON public.receipts FOR DELETE TO authenticated USING (public.is_admin() AND status = 'draft');

-- receipt_items
CREATE POLICY "Select receipt_items all authenticated" ON public.receipt_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert receipt_items warehouse staff" ON public.receipt_items FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update receipt_items warehouse staff" ON public.receipt_items FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete receipt_items warehouse staff" ON public.receipt_items FOR DELETE TO authenticated USING (public.is_warehouse_staff());

-- issues
CREATE POLICY "Select issues all authenticated" ON public.issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert issues warehouse staff" ON public.issues FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update issues warehouse staff" ON public.issues FOR UPDATE TO authenticated USING (public.is_warehouse_staff() AND (status = 'draft' OR public.get_user_role() IN ('Administrator', 'Kepala Gudang')));
CREATE POLICY "Delete issues admin only draft" ON public.issues FOR DELETE TO authenticated USING (public.is_admin() AND status = 'draft');

-- issue_items
CREATE POLICY "Select issue_items all authenticated" ON public.issue_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert issue_items warehouse staff" ON public.issue_items FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update issue_items warehouse staff" ON public.issue_items FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete issue_items warehouse staff" ON public.issue_items FOR DELETE TO authenticated USING (public.is_warehouse_staff());

-- returns
CREATE POLICY "Select returns all authenticated" ON public.returns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert returns warehouse staff" ON public.returns FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update returns warehouse staff" ON public.returns FOR UPDATE TO authenticated USING (public.is_warehouse_staff() AND (status = 'draft' OR public.get_user_role() IN ('Administrator', 'Kepala Gudang')));
CREATE POLICY "Delete returns admin only draft" ON public.returns FOR DELETE TO authenticated USING (public.is_admin() AND status = 'draft');

-- return_items
CREATE POLICY "Select return_items all authenticated" ON public.return_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert return_items warehouse staff" ON public.return_items FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update return_items warehouse staff" ON public.return_items FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete return_items warehouse staff" ON public.return_items FOR DELETE TO authenticated USING (public.is_warehouse_staff());

-- consignments
CREATE POLICY "Select consignments all authenticated" ON public.consignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert consignments warehouse staff" ON public.consignments FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update consignments warehouse staff" ON public.consignments FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete consignments warehouse staff" ON public.consignments FOR DELETE TO authenticated USING (public.is_warehouse_staff());

-- consignment_items
CREATE POLICY "Select consignment_items all authenticated" ON public.consignment_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert consignment_items warehouse staff" ON public.consignment_items FOR INSERT TO authenticated WITH CHECK (public.is_warehouse_staff());
CREATE POLICY "Update consignment_items warehouse staff" ON public.consignment_items FOR UPDATE TO authenticated USING (public.is_warehouse_staff());
CREATE POLICY "Delete consignment_items warehouse staff" ON public.consignment_items FOR DELETE TO authenticated USING (public.is_warehouse_staff());

-- stock_opnames
CREATE POLICY "Select stock_opnames all authenticated" ON public.stock_opnames FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert stock_opnames auditor admin kepala" ON public.stock_opnames FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('Auditor', 'Administrator', 'Kepala Gudang'));
CREATE POLICY "Update stock_opnames auditor admin kepala" ON public.stock_opnames FOR UPDATE TO authenticated USING (public.get_user_role() IN ('Auditor', 'Administrator', 'Kepala Gudang'));
CREATE POLICY "Delete stock_opnames admin" ON public.stock_opnames FOR DELETE TO authenticated USING (public.is_admin());

-- stock_opname_details
CREATE POLICY "Select stock_opname_details all authenticated" ON public.stock_opname_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert stock_opname_details auditor admin kepala" ON public.stock_opname_details FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN ('Auditor', 'Administrator', 'Kepala Gudang'));
CREATE POLICY "Update stock_opname_details auditor admin kepala" ON public.stock_opname_details FOR UPDATE TO authenticated USING (public.get_user_role() IN ('Auditor', 'Administrator', 'Kepala Gudang'));
CREATE POLICY "Delete stock_opname_details admin" ON public.stock_opname_details FOR DELETE TO authenticated USING (public.is_admin());

-- notifications
CREATE POLICY "Select notifications own" ON public.notifications FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()) OR user_id IS NULL);
CREATE POLICY "Update notifications own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Insert notifications all authenticated" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Delete notifications admin" ON public.notifications FOR DELETE TO authenticated USING (public.is_admin());

-- audit_logs
CREATE POLICY "Select audit_logs all authenticated" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert audit_logs all authenticated" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- stock_movements
CREATE POLICY "Select stock_movements all authenticated" ON public.stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert stock_movements all authenticated" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
