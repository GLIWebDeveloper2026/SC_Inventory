-- 1. updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON public.receipts FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_consignments_updated_at BEFORE UPDATE ON public.consignments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_stock_opnames_updated_at BEFORE UPDATE ON public.stock_opnames FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 2. generate_receipt_code()
CREATE OR REPLACE FUNCTION public.generate_receipt_code()
RETURNS TRIGGER AS $$
DECLARE
  today TEXT;
  seq INT;
BEGIN
  IF NEW.receipt_code IS NULL OR NEW.receipt_code = '' THEN
    today := to_char(NEW.date, 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO seq FROM public.receipts WHERE receipt_code LIKE 'RCV-' || today || '-%';
    NEW.receipt_code := 'RCV-' || today || '-' || LPAD(seq::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_receipt_code_trigger BEFORE INSERT ON public.receipts FOR EACH ROW EXECUTE PROCEDURE public.generate_receipt_code();

-- 3. generate_issue_code()
CREATE OR REPLACE FUNCTION public.generate_issue_code()
RETURNS TRIGGER AS $$
DECLARE
  today TEXT;
  seq INT;
BEGIN
  IF NEW.issue_code IS NULL OR NEW.issue_code = '' THEN
    today := to_char(NEW.date, 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO seq FROM public.issues WHERE issue_code LIKE 'ISS-' || today || '-%';
    NEW.issue_code := 'ISS-' || today || '-' || LPAD(seq::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_issue_code_trigger BEFORE INSERT ON public.issues FOR EACH ROW EXECUTE PROCEDURE public.generate_issue_code();

-- 4. generate_return_code()
CREATE OR REPLACE FUNCTION public.generate_return_code()
RETURNS TRIGGER AS $$
DECLARE
  today TEXT;
  seq INT;
BEGIN
  IF NEW.return_code IS NULL OR NEW.return_code = '' THEN
    today := to_char(NEW.date, 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO seq FROM public.returns WHERE return_code LIKE 'RTN-' || today || '-%';
    NEW.return_code := 'RTN-' || today || '-' || LPAD(seq::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_return_code_trigger BEFORE INSERT ON public.returns FOR EACH ROW EXECUTE PROCEDURE public.generate_return_code();

-- 5. generate_consignment_code()
CREATE OR REPLACE FUNCTION public.generate_consignment_code()
RETURNS TRIGGER AS $$
DECLARE
  today TEXT;
  seq INT;
BEGIN
  IF NEW.consignment_code IS NULL OR NEW.consignment_code = '' THEN
    today := to_char(NEW.start_date, 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO seq FROM public.consignments WHERE consignment_code LIKE 'CON-' || today || '-%';
    NEW.consignment_code := 'CON-' || today || '-' || LPAD(seq::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_consignment_code_trigger BEFORE INSERT ON public.consignments FOR EACH ROW EXECUTE PROCEDURE public.generate_consignment_code();

-- 6. generate_opname_code()
CREATE OR REPLACE FUNCTION public.generate_opname_code()
RETURNS TRIGGER AS $$
DECLARE
  today TEXT;
  seq INT;
BEGIN
  IF NEW.opname_code IS NULL OR NEW.opname_code = '' THEN
    today := to_char(NEW.date, 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO seq FROM public.stock_opnames WHERE opname_code LIKE 'SOP-' || today || '-%';
    NEW.opname_code := 'SOP-' || today || '-' || LPAD(seq::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_opname_code_trigger BEFORE INSERT ON public.stock_opnames FOR EACH ROW EXECUTE PROCEDURE public.generate_opname_code();

-- 7. handle_receipt_finalize()
CREATE OR REPLACE FUNCTION public.handle_receipt_finalize()
RETURNS TRIGGER AS $$
DECLARE
  r_item RECORD;
BEGIN
  IF OLD.status = 'draft' AND NEW.status = 'final' THEN
    FOR r_item IN SELECT * FROM public.receipt_items WHERE receipt_id = NEW.id LOOP
      UPDATE public.items SET stock = stock + r_item.qty WHERE id = r_item.item_id;
      INSERT INTO public.stock_movements (date, item_id, movement_type, qty, reference_type, reference_id)
      VALUES (NEW.date, r_item.item_id, 'incoming', r_item.qty, 'receipt', NEW.id);
    END LOOP;
    
    INSERT INTO public.audit_logs (user_id, action, module, detail)
    VALUES (NEW.created_by, 'FINALIZE', 'Receipts', 'Finalized receipt ' || NEW.receipt_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER receipt_finalize_trigger AFTER UPDATE ON public.receipts FOR EACH ROW EXECUTE PROCEDURE public.handle_receipt_finalize();

-- 8. handle_issue_finalize()
CREATE OR REPLACE FUNCTION public.handle_issue_finalize()
RETURNS TRIGGER AS $$
DECLARE
  i_item RECORD;
  current_stock NUMERIC;
BEGIN
  IF OLD.status = 'draft' AND NEW.status = 'final' THEN
    FOR i_item IN SELECT * FROM public.issue_items WHERE issue_id = NEW.id LOOP
      SELECT stock INTO current_stock FROM public.items WHERE id = i_item.item_id;
      IF current_stock < i_item.qty THEN
        RAISE EXCEPTION 'Not enough stock for item %', i_item.item_id;
      END IF;
      
      UPDATE public.items SET stock = stock - i_item.qty WHERE id = i_item.item_id;
      INSERT INTO public.stock_movements (date, item_id, movement_type, qty, reference_type, reference_id)
      VALUES (NEW.date, i_item.item_id, 'outgoing', i_item.qty, 'issue', NEW.id);
    END LOOP;
    
    INSERT INTO public.audit_logs (user_id, action, module, detail)
    VALUES (NEW.created_by, 'FINALIZE', 'Issues', 'Finalized issue ' || NEW.issue_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issue_finalize_trigger AFTER UPDATE ON public.issues FOR EACH ROW EXECUTE PROCEDURE public.handle_issue_finalize();

-- 9. handle_return_finalize()
CREATE OR REPLACE FUNCTION public.handle_return_finalize()
RETURNS TRIGGER AS $$
DECLARE
  rt_item RECORD;
BEGIN
  IF OLD.status = 'draft' AND NEW.status = 'final' THEN
    FOR rt_item IN SELECT * FROM public.return_items WHERE return_id = NEW.id LOOP
      IF NEW.type = 'customer' THEN
        UPDATE public.items SET stock = stock + rt_item.qty WHERE id = rt_item.item_id;
        INSERT INTO public.stock_movements (date, item_id, movement_type, qty, reference_type, reference_id)
        VALUES (NEW.date, rt_item.item_id, 'incoming', rt_item.qty, 'return_customer', NEW.id);
      ELSIF NEW.type = 'supplier' THEN
        UPDATE public.items SET stock = stock - rt_item.qty WHERE id = rt_item.item_id;
        INSERT INTO public.stock_movements (date, item_id, movement_type, qty, reference_type, reference_id)
        VALUES (NEW.date, rt_item.item_id, 'outgoing', rt_item.qty, 'return_supplier', NEW.id);
      END IF;
    END LOOP;
    
    INSERT INTO public.audit_logs (user_id, action, module, detail)
    VALUES (NEW.created_by, 'FINALIZE', 'Returns', 'Finalized return ' || NEW.return_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER return_finalize_trigger AFTER UPDATE ON public.returns FOR EACH ROW EXECUTE PROCEDURE public.handle_return_finalize();

-- 10. handle_opname_finalize()
CREATE OR REPLACE FUNCTION public.handle_opname_finalize()
RETURNS TRIGGER AS $$
DECLARE
  op_detail RECORD;
BEGIN
  IF OLD.status = 'in_progress' AND NEW.status = 'completed' THEN
    FOR op_detail IN SELECT * FROM public.stock_opname_details WHERE stock_opname_id = NEW.id LOOP
      IF op_detail.diff != 0 THEN
        UPDATE public.items SET stock = op_detail.physical_qty WHERE id = op_detail.item_id;
        INSERT INTO public.stock_movements (date, item_id, movement_type, qty, reference_type, reference_id)
        VALUES (NEW.date, op_detail.item_id, 'adjustment', op_detail.diff, 'stock_opname', NEW.id);
      END IF;
    END LOOP;
    
    INSERT INTO public.audit_logs (user_id, action, module, detail)
    VALUES (NEW.auditor_id, 'FINALIZE', 'Stock Opnames', 'Finalized opname ' || NEW.opname_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER opname_finalize_trigger AFTER UPDATE ON public.stock_opnames FOR EACH ROW EXECUTE PROCEDURE public.handle_opname_finalize();

-- 11. check_low_stock()
CREATE OR REPLACE FUNCTION public.check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock < NEW.min_stock AND OLD.stock >= NEW.min_stock THEN
    INSERT INTO public.notifications (user_id, type, title, message)
    SELECT u.id, 'warning', 'Low Stock Alert', 'Item ' || NEW.name || ' (Code: ' || NEW.code || ') is below minimum stock.'
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE r.name IN ('Administrator', 'Kepala Gudang', 'Admin Gudang');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER low_stock_trigger AFTER UPDATE OF stock ON public.items FOR EACH ROW EXECUTE PROCEDURE public.check_low_stock();
