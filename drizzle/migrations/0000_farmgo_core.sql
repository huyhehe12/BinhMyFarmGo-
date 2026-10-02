CREATE TYPE public.app_role AS ENUM ('admin','supplier');
CREATE TYPE public.request_status AS ENUM ('cho_xac_nhan','da_xac_nhan','hoan_tat','da_huy');
CREATE TYPE public.payment_status AS ENUM ('chua_thanh_toan','cho_kiem_tra','da_thanh_toan');
CREATE TYPE public.location_category AS ENUM ('diem_ban','nha_vuon','trai_nghiem','diem_nhan_hang');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.suppliers (
  id text PRIMARY KEY,
  name text NOT NULL,
  is_demo boolean NOT NULL DEFAULT true,
  phone text,
  zalo_user_id text,
  contact_verified boolean NOT NULL DEFAULT false,
  bank_bin text,
  bank_name text,
  bank_account text,
  bank_holder text,
  bank_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.supplier_members (
  user_id uuid NOT NULL,
  supplier_id text NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, supplier_id)
);
GRANT SELECT, INSERT, DELETE ON public.supplier_members TO authenticated;
GRANT ALL ON public.supplier_members TO service_role;
ALTER TABLE public.supplier_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_supplier_member(_user_id uuid, _supplier_id text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.supplier_members WHERE user_id = _user_id AND supplier_id = _supplier_id)
$$;

CREATE POLICY "members read own" ON public.supplier_members FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage members" ON public.supplier_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "supplier read" ON public.suppliers FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), id));
CREATE POLICY "admin manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Nhà cung cấp chỉ được sửa thông tin của mình, không tự xác minh
CREATE OR REPLACE FUNCTION public.guard_supplier_update() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(),'admin') THEN
    NEW.is_demo := OLD.is_demo;
    NEW.contact_verified := CASE WHEN NEW.phone IS DISTINCT FROM OLD.phone OR NEW.zalo_user_id IS DISTINCT FROM OLD.zalo_user_id THEN false ELSE OLD.contact_verified END;
    NEW.bank_verified := CASE WHEN NEW.bank_account IS DISTINCT FROM OLD.bank_account OR NEW.bank_bin IS DISTINCT FROM OLD.bank_bin OR NEW.bank_holder IS DISTINCT FROM OLD.bank_holder THEN false ELSE OLD.bank_verified END;
    NEW.id := OLD.id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER suppliers_guard BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.guard_supplier_update();
CREATE POLICY "supplier update own" ON public.suppliers FOR UPDATE TO authenticated USING (public.is_supplier_member(auth.uid(), id)) WITH CHECK (public.is_supplier_member(auth.uid(), id));

CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category public.location_category NOT NULL,
  address text,
  latitude double precision,
  longitude double precision,
  contact text,
  maps_url text NOT NULL,
  embed_url text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT loc_has_place CHECK (address IS NOT NULL OR (latitude IS NOT NULL AND longitude IS NOT NULL)),
  CONSTRAINT loc_maps_url CHECK (maps_url ~ '^https://(www\.)?google\.[a-z.]+/maps|^https://maps\.app\.goo\.gl/'),
  CONSTRAINT loc_embed_url CHECK (embed_url IS NULL OR embed_url ~ '^https://www\.google\.com/maps/embed\?pb=')
);
GRANT SELECT ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public verified" ON public.locations FOR SELECT TO anon, authenticated USING (verified OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage locations" ON public.locations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.purchase_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  submission_key text NOT NULL,
  supplier_id text NOT NULL REFERENCES public.suppliers(id),
  is_demo boolean NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  contact_method text NOT NULL,
  delivery_method text NOT NULL,
  address text,
  desired_date date,
  time_slot text,
  note text,
  status public.request_status NOT NULL DEFAULT 'cho_xac_nhan',
  confirmed_total integer,
  shipping_fee integer,
  seller_note text,
  payment_status public.payment_status NOT NULL DEFAULT 'chua_thanh_toan',
  payment_confirmed_by uuid,
  payment_confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (submission_key, supplier_id)
);
GRANT SELECT, UPDATE ON public.purchase_requests TO authenticated;
GRANT ALL ON public.purchase_requests TO service_role;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "supplier read requests" ON public.purchase_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), supplier_id));
CREATE POLICY "supplier update requests" ON public.purchase_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), supplier_id)) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), supplier_id));

CREATE TABLE public.request_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0 AND quantity <= 1000),
  unit text NOT NULL,
  reference_price text
);
GRANT SELECT ON public.request_items TO authenticated;
GRANT ALL ON public.request_items TO service_role;
ALTER TABLE public.request_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read items" ON public.request_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.purchase_requests r WHERE r.id = request_id AND (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), r.supplier_id))));

CREATE TABLE public.request_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  changed_by uuid,
  status public.request_status,
  payment_status public.payment_status,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.request_history TO authenticated;
GRANT ALL ON public.request_history TO service_role;
ALTER TABLE public.request_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read history" ON public.request_history FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.purchase_requests r WHERE r.id = request_id AND (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), r.supplier_id))));

-- Kiểm soát chuyển trạng thái và thanh toán
CREATE OR REPLACE FUNCTION public.guard_request_update() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- trường không được sửa
  NEW.code := OLD.code; NEW.supplier_id := OLD.supplier_id; NEW.is_demo := OLD.is_demo;
  NEW.customer_name := OLD.customer_name; NEW.customer_phone := OLD.customer_phone;
  NEW.submission_key := OLD.submission_key; NEW.created_at := OLD.created_at;
  IF NEW.status <> OLD.status THEN
    IF NOT ((OLD.status='cho_xac_nhan' AND NEW.status IN ('da_xac_nhan','da_huy'))
         OR (OLD.status='da_xac_nhan' AND NEW.status IN ('hoan_tat','da_huy'))) THEN
      RAISE EXCEPTION 'Chuyển trạng thái không hợp lệ';
    END IF;
    IF NEW.status='da_xac_nhan' AND NEW.confirmed_total IS NULL THEN
      RAISE EXCEPTION 'Cần nhập tổng tiền trước khi xác nhận';
    END IF;
  END IF;
  IF NEW.payment_status <> OLD.payment_status THEN
    IF NEW.payment_status='da_thanh_toan' THEN
      IF OLD.is_demo THEN RAISE EXCEPTION 'Yêu cầu thử nghiệm không nhận thanh toán'; END IF;
      NEW.payment_confirmed_by := auth.uid(); NEW.payment_confirmed_at := now();
    ELSIF NEW.payment_status='cho_kiem_tra' AND auth.uid() IS NOT NULL THEN
      RAISE EXCEPTION 'Chỉ khách hàng báo đã chuyển khoản';
    END IF;
  END IF;
  NEW.updated_at := now();
  INSERT INTO public.request_history(request_id, changed_by, status, payment_status)
    VALUES (NEW.id, auth.uid(), NEW.status, NEW.payment_status);
  RETURN NEW;
END $$;
CREATE TRIGGER purchase_requests_guard BEFORE UPDATE ON public.purchase_requests FOR EACH ROW EXECUTE FUNCTION public.guard_request_update();

CREATE TABLE public.notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  channel text NOT NULL,
  status text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notification_log TO authenticated;
GRANT ALL ON public.notification_log TO service_role;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read notif" ON public.notification_log FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.purchase_requests r WHERE r.id = request_id AND (public.has_role(auth.uid(),'admin') OR public.is_supplier_member(auth.uid(), r.supplier_id))));

CREATE TABLE public.lookup_attempts (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.lookup_attempts TO service_role;
ALTER TABLE public.lookup_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX lookup_attempts_ip_time ON public.lookup_attempts (ip, created_at);

INSERT INTO public.suppliers (id, name, is_demo) VALUES
 ('nhom-rau-ven-song','Nhóm trồng rau vùng ven sông',true),
 ('nhom-vuon-cay-an-trai','Nhóm vườn cây ăn trái',true),
 ('nhom-trong-rau-mau','Nhóm trồng rau màu',true);