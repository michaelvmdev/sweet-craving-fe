-- ================================================================
-- El Dulce Antojo — Esquema de Base de Datos
-- Motor      : PostgreSQL 14+
-- Empresa    : The Lions S.A.C.
-- Marca      : El Dulce Antojo
-- ================================================================
-- Tablas principales
--   users, categories, sub_categories, products, configuration
-- Tablas sugeridas (ver sección SUGERENCIAS)
--   product_images, product_sizes, business_hours
-- ================================================================

-- Extensión UUID (requerida en PG < 13; en PG 13+ gen_random_uuid() ya existe)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Función helper para updated_at automático
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ================================================================
-- TABLA: users
-- Acceso al panel de administración
-- ================================================================
CREATE TABLE users (
  user_id       UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,  -- usar bcrypt o argon2, NUNCA texto plano
  user_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();


-- ================================================================
-- TABLA: categories
-- ================================================================
CREATE TABLE categories (
  category_id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name   VARCHAR(100) NOT NULL,
  category_icon   VARCHAR(10),                    -- emoji para la UI  e.g. '🎂'
  category_slug   VARCHAR(100) NOT NULL UNIQUE,   -- e.g. 'tortas-y-pasteles'
  sort_order      SMALLINT     NOT NULL DEFAULT 0,
  category_active BOOLEAN      NOT NULL DEFAULT TRUE
);


-- ================================================================
-- TABLA: sub_categories
-- ================================================================
CREATE TABLE sub_categories (
  sub_category_id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         UUID         NOT NULL
                        REFERENCES categories(category_id) ON DELETE CASCADE,
  sub_category_name   VARCHAR(150) NOT NULL,
  sub_category_active BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_sub_categories_category_id ON sub_categories(category_id);


-- ================================================================
-- TABLA: products
-- ================================================================
CREATE TABLE products (
  product_id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name       VARCHAR(150)  NOT NULL,
  product_summary    TEXT,
  product_unit_price NUMERIC(8,2),              -- NULL = precio a consultar
  category_id        UUID          NOT NULL
                       REFERENCES categories(category_id),
  sub_category_id    UUID
                       REFERENCES sub_categories(sub_category_id),
  featured           BOOLEAN       NOT NULL DEFAULT FALSE,
  product_slug       VARCHAR(170)  UNIQUE,      -- e.g. 'torta-de-chocolate'
  sort_order         SMALLINT      NOT NULL DEFAULT 0,
  product_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category_id     ON products(category_id);
CREATE INDEX idx_products_sub_category_id ON products(sub_category_id);
CREATE INDEX idx_products_featured        ON products(featured)       WHERE featured      = TRUE;
CREATE INDEX idx_products_active          ON products(product_active) WHERE product_active = TRUE;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();


-- ================================================================
-- TABLA: configuration   (singleton — máximo 1 fila)
-- ================================================================
CREATE TABLE configuration (
  config_id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name       VARCHAR(200),  -- 'The Lions S.A.C.'
  brand_name         VARCHAR(200),  -- 'El Dulce Antojo'
  tagline            VARCHAR(300),
  cell_phone_number  VARCHAR(20),
  whatsapp_url       VARCHAR(500),
  url_logo           VARCHAR(500),
  instagram_handle   VARCHAR(100),
  facebook_handle    VARCHAR(100),
  tiktok_handle      VARCHAR(100),
  -- garantiza exactamente una fila en la tabla
  singleton          BOOLEAN      NOT NULL UNIQUE DEFAULT TRUE,
  CONSTRAINT cfg_only_one_row CHECK (singleton = TRUE)
);


-- ================================================================
-- TABLA: product_images
-- Carrusel de imágenes por producto
-- sort_order determina el orden en el carrusel (0 = primera / portada)
-- ================================================================
CREATE TABLE product_images (
  product_image_id UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID         NOT NULL
                     REFERENCES products(product_id) ON DELETE CASCADE,
  url_image        VARCHAR(500) NOT NULL,
  sort_order       SMALLINT     NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);


-- ================================================================
-- [SUGERIDA] TABLA: product_sizes
-- Presentaciones disponibles por producto (unidad, caja x6, etc.)
-- ================================================================
CREATE TABLE product_sizes (
  size_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL
                REFERENCES products(product_id) ON DELETE CASCADE,
  size_label  VARCHAR(50) NOT NULL,   -- 'Pequeña', 'Mediana', 'Caja x6' …
  size_price  NUMERIC(8,2),           -- precio diferencial opcional
  sort_order  SMALLINT    NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);


-- ================================================================
-- [SUGERIDA] TABLA: business_hours
-- Horarios configurables sin tocar el código fuente
-- ================================================================
CREATE TABLE business_hours (
  hour_id     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_label   VARCHAR(50) NOT NULL,   -- 'Lunes - Viernes'
  open_time   TIME        NOT NULL,   -- 09:00
  close_time  TIME        NOT NULL,   -- 19:00
  is_closed   BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT    NOT NULL DEFAULT 0
);


-- ================================================================
-- ================================================================
--                        D A T A
-- ================================================================
-- ================================================================


-- ================================================================
-- INSERTS: categories
-- 18 categorías del catálogo completo (PDF El Dulce Antojo)
-- IDs secuenciales de tipo UUID para fácil referencia
-- ================================================================

INSERT INTO categories
  (category_id, category_name, category_icon, category_slug, sort_order)
VALUES
  ('10000001-0000-0000-0000-000000000000','Tortas y Pasteles',              '🎂','tortas-y-pasteles',              1),
  ('10000002-0000-0000-0000-000000000000','Queques, Bizcochos y Muffins',   '🧁','queques-bizcochos-muffins',      2),
  ('10000003-0000-0000-0000-000000000000','Pyes y Tartas',                  '🥧','pyes-y-tartas',                  3),
  ('10000004-0000-0000-0000-000000000000','Cheesecakes',                    '🍰','cheesecakes',                    4),
  ('10000005-0000-0000-0000-000000000000','Postres Fríos',                  '🍮','postres-frios',                  5),
  ('10000006-0000-0000-0000-000000000000','Bocaditos y Pirotines',          '🍫','bocaditos-y-pirotines',          6),
  ('10000007-0000-0000-0000-000000000000','Galletas y Cookies',             '🍪','galletas-y-cookies',             7),
  ('10000008-0000-0000-0000-000000000000','Brownies y Barras',              '🟫','brownies-y-barras',              8),
  ('10000009-0000-0000-0000-000000000000','Vasitos y Copas',                '🥤','vasitos-y-copas',                9),
  ('10000010-0000-0000-0000-000000000000','Mini Postres',                   '🍬','mini-postres',                  10),
  ('10000011-0000-0000-0000-000000000000','Panadería Dulce',                '🥐','panaderia-dulce',               11),
  ('10000012-0000-0000-0000-000000000000','Empanadas',                      '🫔','empanadas',                     12),
  ('10000013-0000-0000-0000-000000000000','Cupcakes',                       '🧁','cupcakes',                      13),
  ('10000014-0000-0000-0000-000000000000','Semifríos y Tortas Heladas',     '🧊','semifrios-y-tortas-heladas',    14),
  ('10000015-0000-0000-0000-000000000000','Confitería Artesanal',           '🍭','confiteria-artesanal',          15),
  ('10000016-0000-0000-0000-000000000000','Postres Peruanos Tradicionales', '🎌','postres-peruanos-tradicionales',16),
  ('10000017-0000-0000-0000-000000000000','Cajas Regalo y Desayunos',       '🎁','cajas-regalo-y-desayunos',      17),
  ('10000018-0000-0000-0000-000000000000','Waffles, Crepes y Pancakes',     '🧇','waffles-crepes-pancakes',       18);


-- ================================================================
-- INSERTS: sub_categories
-- 42 subcategorías distribuidas entre las 18 categorías
-- ================================================================

INSERT INTO sub_categories
  (sub_category_id, category_id, sub_category_name)
VALUES
  -- ── Tortas y Pasteles (cat 01) ────────────────────────────────
  ('20000001-0000-0000-0000-000000000000','10000001-0000-0000-0000-000000000000','Clásicas'),
  ('20000002-0000-0000-0000-000000000000','10000001-0000-0000-0000-000000000000','Húmedas'),
  ('20000003-0000-0000-0000-000000000000','10000001-0000-0000-0000-000000000000','Decoradas'),
  ('20000004-0000-0000-0000-000000000000','10000001-0000-0000-0000-000000000000','De Ocasión'),

  -- ── Queques, Bizcochos y Muffins (cat 02) ────────────────────
  ('20000005-0000-0000-0000-000000000000','10000002-0000-0000-0000-000000000000','Queques'),
  ('20000006-0000-0000-0000-000000000000','10000002-0000-0000-0000-000000000000','Bizcochos'),
  ('20000007-0000-0000-0000-000000000000','10000002-0000-0000-0000-000000000000','Muffins'),

  -- ── Pyes y Tartas (cat 03) ───────────────────────────────────
  ('20000008-0000-0000-0000-000000000000','10000003-0000-0000-0000-000000000000','Pyes'),
  ('20000009-0000-0000-0000-000000000000','10000003-0000-0000-0000-000000000000','Tartas Europeas'),
  ('20000010-0000-0000-0000-000000000000','10000003-0000-0000-0000-000000000000','Tartaletas Individuales'),

  -- ── Cheesecakes (cat 04) ─────────────────────────────────────
  ('20000011-0000-0000-0000-000000000000','10000004-0000-0000-0000-000000000000','Horneados NY Style'),
  ('20000012-0000-0000-0000-000000000000','10000004-0000-0000-0000-000000000000','Fríos Sin Hornear'),
  ('20000013-0000-0000-0000-000000000000','10000004-0000-0000-0000-000000000000','Especiales'),

  -- ── Postres Fríos (cat 05) ───────────────────────────────────
  ('20000014-0000-0000-0000-000000000000','10000005-0000-0000-0000-000000000000','Flanes y Cremas'),
  ('20000015-0000-0000-0000-000000000000','10000005-0000-0000-0000-000000000000','Mousses'),
  ('20000016-0000-0000-0000-000000000000','10000005-0000-0000-0000-000000000000','Internacionales'),
  ('20000017-0000-0000-0000-000000000000','10000005-0000-0000-0000-000000000000','Peruanos'),

  -- ── Bocaditos y Pirotines (cat 06) ───────────────────────────
  ('20000018-0000-0000-0000-000000000000','10000006-0000-0000-0000-000000000000','Trufas'),
  ('20000019-0000-0000-0000-000000000000','10000006-0000-0000-0000-000000000000','Alfajores'),
  ('20000020-0000-0000-0000-000000000000','10000006-0000-0000-0000-000000000000','Otros Bocaditos'),
  ('20000021-0000-0000-0000-000000000000','10000006-0000-0000-0000-000000000000','De Novia'),

  -- ── Galletas y Cookies (cat 07) ──────────────────────────────
  ('20000022-0000-0000-0000-000000000000','10000007-0000-0000-0000-000000000000','Cookies Americanas'),
  ('20000023-0000-0000-0000-000000000000','10000007-0000-0000-0000-000000000000','Galletas Clásicas'),
  ('20000024-0000-0000-0000-000000000000','10000007-0000-0000-0000-000000000000','Decoradas'),

  -- ── Brownies y Barras (cat 08) ───────────────────────────────
  ('20000025-0000-0000-0000-000000000000','10000008-0000-0000-0000-000000000000','Brownies'),
  ('20000026-0000-0000-0000-000000000000','10000008-0000-0000-0000-000000000000','Blondies y Barras'),

  -- ── Vasitos y Copas (cat 09) ─────────────────────────────────
  ('20000027-0000-0000-0000-000000000000','10000009-0000-0000-0000-000000000000','Vasitos'),
  ('20000028-0000-0000-0000-000000000000','10000009-0000-0000-0000-000000000000','Copas y Parfaits'),

  -- ── Mini Postres (cat 10) ────────────────────────────────────
  ('20000029-0000-0000-0000-000000000000','10000010-0000-0000-0000-000000000000','Variedad'),

  -- ── Panadería Dulce (cat 11) ─────────────────────────────────
  ('20000030-0000-0000-0000-000000000000','10000011-0000-0000-0000-000000000000','Hojaldres y Laminados'),
  ('20000031-0000-0000-0000-000000000000','10000011-0000-0000-0000-000000000000','Panes Dulces'),

  -- ── Empanadas (cat 12) ───────────────────────────────────────
  ('20000032-0000-0000-0000-000000000000','10000012-0000-0000-0000-000000000000','Dulces'),
  ('20000033-0000-0000-0000-000000000000','10000012-0000-0000-0000-000000000000','Saladas para Eventos'),

  -- ── Cupcakes (cat 13) ────────────────────────────────────────
  ('20000034-0000-0000-0000-000000000000','10000013-0000-0000-0000-000000000000','Bases'),
  ('20000035-0000-0000-0000-000000000000','10000013-0000-0000-0000-000000000000','Coberturas'),

  -- ── Semifríos y Tortas Heladas (cat 14) ──────────────────────
  ('20000036-0000-0000-0000-000000000000','10000014-0000-0000-0000-000000000000','Variedad'),

  -- ── Confitería Artesanal (cat 15) ────────────────────────────
  ('20000037-0000-0000-0000-000000000000','10000015-0000-0000-0000-000000000000','Variedad'),

  -- ── Postres Peruanos Tradicionales (cat 16) ──────────────────
  ('20000038-0000-0000-0000-000000000000','10000016-0000-0000-0000-000000000000','Variedad'),

  -- ── Cajas Regalo y Desayunos (cat 17) ────────────────────────
  ('20000039-0000-0000-0000-000000000000','10000017-0000-0000-0000-000000000000','Cajas Surtidas'),
  ('20000040-0000-0000-0000-000000000000','10000017-0000-0000-0000-000000000000','Desayunos Sorpresa'),

  -- ── Waffles, Crepes y Pancakes (cat 18) ──────────────────────
  ('20000041-0000-0000-0000-000000000000','10000018-0000-0000-0000-000000000000','Waffles'),
  ('20000042-0000-0000-0000-000000000000','10000018-0000-0000-0000-000000000000','Crepes y Pancakes');


-- ================================================================
-- INSERTS: products
-- 22 productos del db.json mapeados a las 18 categorías del PDF
-- ================================================================

INSERT INTO products
  (product_id, product_name, product_summary, product_unit_price,
   category_id, sub_category_id, featured, product_slug, sort_order)
VALUES

  -- ── TORTAS Y PASTELES ─────────────────────────────────────────
  (
    '30000001-0000-0000-0000-000000000000',
    'Torta de Chocolate',
    'Bizcocho de chocolate con ganache y cobertura artesanal de cacao',
    30.00,
    '10000001-0000-0000-0000-000000000000',   -- Tortas y Pasteles
    '20000001-0000-0000-0000-000000000000',   -- Clásicas
    TRUE, 'torta-de-chocolate', 1
  ),
  (
    '30000002-0000-0000-0000-000000000000',
    'Tres Leches',
    'Esponjosa torta bañada en tres tipos de leche con chantilly suave',
    25.00,
    '10000001-0000-0000-0000-000000000000',
    '20000002-0000-0000-0000-000000000000',   -- Húmedas
    TRUE, 'tres-leches', 2
  ),

  -- ── QUEQUES ───────────────────────────────────────────────────
  (
    '30000003-0000-0000-0000-000000000000',
    'Queque de Maracuyá',
    'Queque húmedo y esponjoso con aroma y sabor intenso a maracuyá',
    25.00,
    '10000002-0000-0000-0000-000000000000',   -- Queques, Bizcochos y Muffins
    '20000005-0000-0000-0000-000000000000',   -- Queques
    TRUE, 'queque-de-maracuya', 1
  ),
  (
    '30000004-0000-0000-0000-000000000000',
    'Queque Marmoleado',
    'Clásico queque marmoleado de vainilla y chocolate, jugoso y esponjoso',
    24.00,
    '10000002-0000-0000-0000-000000000000',
    '20000005-0000-0000-0000-000000000000',
    FALSE, 'queque-marmoleado', 2
  ),
  (
    '30000005-0000-0000-0000-000000000000',
    'Queque de Chispas de Chocolate',
    'Suave queque de vainilla con chispas de chocolate en cada bocado',
    24.00,
    '10000002-0000-0000-0000-000000000000',
    '20000005-0000-0000-0000-000000000000',
    FALSE, 'queque-de-chispas-de-chocolate', 3
  ),
  (
    '30000006-0000-0000-0000-000000000000',
    'Queque de Vainilla',
    'Clásico queque de vainilla, ligero y esponjoso, perfecto para toda ocasión',
    22.00,
    '10000002-0000-0000-0000-000000000000',
    '20000005-0000-0000-0000-000000000000',
    FALSE, 'queque-de-vainilla', 4
  ),

  -- ── PYES Y TARTAS ─────────────────────────────────────────────
  (
    '30000007-0000-0000-0000-000000000000',
    'Pye de Limón',
    'Base crocante de galleta con relleno cremoso de limón y merengue tostado',
    25.00,
    '10000003-0000-0000-0000-000000000000',   -- Pyes y Tartas
    '20000008-0000-0000-0000-000000000000',   -- Pyes
    TRUE, 'pye-de-limon', 1
  ),
  (
    '30000008-0000-0000-0000-000000000000',
    'Pye de Maracuyá',
    'Cremoso pye de maracuyá tropical con base de galleta mantecada',
    27.00,
    '10000003-0000-0000-0000-000000000000',
    '20000008-0000-0000-0000-000000000000',
    TRUE, 'pye-de-maracuya', 2
  ),
  (
    '30000009-0000-0000-0000-000000000000',
    'Pye de Manzana',
    'Clásico pye de manzana con canela, masa dorada y relleno caramelizado',
    24.00,
    '10000003-0000-0000-0000-000000000000',
    '20000008-0000-0000-0000-000000000000',
    FALSE, 'pye-de-manzana', 3
  ),
  (
    '30000010-0000-0000-0000-000000000000',
    'Tartaleta de Fresa',
    'Base de masa quebrada con crema pastelera y fresas frescas de temporada',
    10.00,
    '10000003-0000-0000-0000-000000000000',
    '20000010-0000-0000-0000-000000000000',   -- Tartaletas Individuales
    FALSE, 'tartaleta-de-fresa', 4
  ),

  -- ── CHEESECAKES ───────────────────────────────────────────────
  (
    '30000011-0000-0000-0000-000000000000',
    'Cheesecake de Maracuyá',
    'Cremoso cheesecake con cobertura de maracuyá fresca, ácido y delicioso',
    28.00,
    '10000004-0000-0000-0000-000000000000',   -- Cheesecakes
    '20000011-0000-0000-0000-000000000000',   -- Horneados NY Style
    TRUE, 'cheesecake-de-maracuya', 1
  ),
  (
    '30000012-0000-0000-0000-000000000000',
    'Cheesecake de Fresa',
    'Cremoso cheesecake con cobertura de fresas frescas y coulis artesanal',
    28.00,
    '10000004-0000-0000-0000-000000000000',
    '20000011-0000-0000-0000-000000000000',
    FALSE, 'cheesecake-de-fresa', 2
  ),

  -- ── POSTRES FRÍOS ─────────────────────────────────────────────
  (
    '30000013-0000-0000-0000-000000000000',
    'Crema Volteada',
    'Clásica crema volteada casera con caramelo dorado, suave y cremosa',
    22.00,
    '10000005-0000-0000-0000-000000000000',   -- Postres Fríos
    '20000014-0000-0000-0000-000000000000',   -- Flanes y Cremas
    TRUE, 'crema-volteada', 1
  ),

  -- ── BOCADITOS Y PIROTINES ─────────────────────────────────────
  (
    '30000014-0000-0000-0000-000000000000',
    'Alfajores',
    'Galletas suaves de maicena unidas con manjar blanco y espolvoreadas con azúcar',
    5.00,
    '10000006-0000-0000-0000-000000000000',   -- Bocaditos y Pirotines
    '20000019-0000-0000-0000-000000000000',   -- Alfajores
    FALSE, 'alfajores', 1
  ),
  (
    '30000015-0000-0000-0000-000000000000',
    'Trufas de Chocolate',
    'Trufas artesanales de chocolate semi-amargo con cobertura de cacao',
    5.00,
    '10000006-0000-0000-0000-000000000000',
    '20000018-0000-0000-0000-000000000000',   -- Trufas
    FALSE, 'trufas-de-chocolate', 2
  ),
  (
    '30000016-0000-0000-0000-000000000000',
    'Trufas de Manjar de Maracuyá',
    'Trufas rellenas de manjar de maracuyá con cobertura de chocolate',
    5.00,
    '10000006-0000-0000-0000-000000000000',
    '20000018-0000-0000-0000-000000000000',
    FALSE, 'trufas-de-manjar-de-maracuya', 3
  ),
  (
    '30000017-0000-0000-0000-000000000000',
    'Trufas de Coco',
    'Trufas de chocolate con ralladura de coco, suaves y deliciosamente tropicales',
    5.00,
    '10000006-0000-0000-0000-000000000000',
    '20000018-0000-0000-0000-000000000000',
    FALSE, 'trufas-de-coco', 4
  ),

  -- ── BROWNIES Y BARRAS ─────────────────────────────────────────
  (
    '30000018-0000-0000-0000-000000000000',
    'Brownie de Chocolate con Pecanas',
    'Brownie húmedo de chocolate con trozos de pecanas y chips de chocolate',
    25.00,
    '10000008-0000-0000-0000-000000000000',   -- Brownies y Barras
    '20000025-0000-0000-0000-000000000000',   -- Brownies
    FALSE, 'brownie-de-chocolate-con-pecanas', 1
  ),

  -- ── VASITOS Y COPAS ───────────────────────────────────────────
  (
    '30000019-0000-0000-0000-000000000000',
    'Vasito Chocolate con Mousse de Lúcuma',
    'Vasito de chocolate negro con mousse cremosa de lúcuma peruana',
    10.00,
    '10000009-0000-0000-0000-000000000000',   -- Vasitos y Copas
    '20000027-0000-0000-0000-000000000000',   -- Vasitos
    FALSE, 'vasito-mousse-de-lucuma', 1
  ),
  (
    '30000020-0000-0000-0000-000000000000',
    'Vasito Suspiro a la Limeña',
    'Vasito de chocolate con suspiro a la limeña, mezcla perfecta de sabores',
    10.00,
    '10000009-0000-0000-0000-000000000000',
    '20000027-0000-0000-0000-000000000000',
    FALSE, 'vasito-suspiro-a-la-limena', 2
  ),

  -- ── MINI POSTRES ──────────────────────────────────────────────
  (
    '30000021-0000-0000-0000-000000000000',
    'Mini Pye de Limón',
    'Versión individual del clásico pye de limón, ideal para antojos personales',
    12.00,
    '10000010-0000-0000-0000-000000000000',   -- Mini Postres
    '20000029-0000-0000-0000-000000000000',   -- Variedad
    FALSE, 'mini-pye-de-limon', 1
  ),
  (
    '30000022-0000-0000-0000-000000000000',
    'Mini Cheesecake de Maracuyá',
    'Versión individual del cheesecake de maracuyá, cremoso y refrescante',
    12.00,
    '10000010-0000-0000-0000-000000000000',
    '20000029-0000-0000-0000-000000000000',
    FALSE, 'mini-cheesecake-de-maracuya', 2
  );


-- ================================================================
-- INSERTS: product_sizes
-- Presentaciones de cada producto (del db.json)
-- ================================================================

INSERT INTO product_sizes (product_id, size_label, sort_order) VALUES
  -- Torta de Chocolate
  ('30000001-0000-0000-0000-000000000000','Pequeña',   1),
  ('30000001-0000-0000-0000-000000000000','Mediana',   2),
  ('30000001-0000-0000-0000-000000000000','Grande',    3),
  -- Tres Leches
  ('30000002-0000-0000-0000-000000000000','Pequeña',   1),
  ('30000002-0000-0000-0000-000000000000','Mediana',   2),
  ('30000002-0000-0000-0000-000000000000','Grande',    3),
  -- Queques (todos: Entero)
  ('30000003-0000-0000-0000-000000000000','Entero',    1),
  ('30000004-0000-0000-0000-000000000000','Entero',    1),
  ('30000005-0000-0000-0000-000000000000','Entero',    1),
  ('30000006-0000-0000-0000-000000000000','Entero',    1),
  -- Pyes grandes
  ('30000007-0000-0000-0000-000000000000','Personal',  1),
  ('30000007-0000-0000-0000-000000000000','Familiar',  2),
  ('30000008-0000-0000-0000-000000000000','Personal',  1),
  ('30000008-0000-0000-0000-000000000000','Familiar',  2),
  ('30000009-0000-0000-0000-000000000000','Personal',  1),
  ('30000009-0000-0000-0000-000000000000','Familiar',  2),
  -- Tartaleta de Fresa
  ('30000010-0000-0000-0000-000000000000','Individual',1),
  -- Cheesecakes
  ('30000011-0000-0000-0000-000000000000','Personal',  1),
  ('30000011-0000-0000-0000-000000000000','Familiar',  2),
  ('30000012-0000-0000-0000-000000000000','Personal',  1),
  ('30000012-0000-0000-0000-000000000000','Familiar',  2),
  -- Crema Volteada
  ('30000013-0000-0000-0000-000000000000','Individual',1),
  ('30000013-0000-0000-0000-000000000000','Familiar',  2),
  -- Alfajores / Trufas (unidad y cajas)
  ('30000014-0000-0000-0000-000000000000','Unidad',    1),
  ('30000014-0000-0000-0000-000000000000','Caja x6',   2),
  ('30000014-0000-0000-0000-000000000000','Caja x12',  3),
  ('30000015-0000-0000-0000-000000000000','Unidad',    1),
  ('30000015-0000-0000-0000-000000000000','Caja x6',   2),
  ('30000015-0000-0000-0000-000000000000','Caja x12',  3),
  ('30000016-0000-0000-0000-000000000000','Unidad',    1),
  ('30000016-0000-0000-0000-000000000000','Caja x6',   2),
  ('30000016-0000-0000-0000-000000000000','Caja x12',  3),
  ('30000017-0000-0000-0000-000000000000','Unidad',    1),
  ('30000017-0000-0000-0000-000000000000','Caja x6',   2),
  ('30000017-0000-0000-0000-000000000000','Caja x12',  3),
  -- Brownie
  ('30000018-0000-0000-0000-000000000000','Unidad',    1),
  ('30000018-0000-0000-0000-000000000000','Caja x4',   2),
  -- Vasitos / Mini
  ('30000019-0000-0000-0000-000000000000','Individual',1),
  ('30000020-0000-0000-0000-000000000000','Individual',1),
  ('30000021-0000-0000-0000-000000000000','Individual',1),
  ('30000022-0000-0000-0000-000000000000','Individual',1);


-- ================================================================
-- INSERTS: configuration
-- ================================================================

INSERT INTO configuration (
  config_id, company_name, brand_name, tagline,
  cell_phone_number, whatsapp_url, url_logo,
  instagram_handle, facebook_handle, tiktok_handle
) VALUES (
  '40000001-0000-0000-0000-000000000000',
  'The Lions S.A.C.',
  'El Dulce Antojo',
  'Hechos con amor, para endulzar los momentos',
  '967 636 632',
  'https://wa.me/51967636632',
  '/logo.png',
  'eldulceantojo',
  'eldulceantojo',
  'eldulceantojo'
);


-- ================================================================
-- INSERTS: business_hours
-- ================================================================

INSERT INTO business_hours (day_label, open_time, close_time, sort_order) VALUES
  ('Lunes - Viernes', '09:00', '19:00', 1),
  ('Sábados',         '08:00', '20:00', 2),
  ('Domingos',        '09:00', '18:00', 3);


-- ================================================================
-- INSERTS: users
-- !! Reemplaza password_hash con un hash real (bcrypt/argon2)
--    Ejemplo Node.js: bcrypt.hash('tu_contraseña', 12)
--    Ejemplo Python : bcrypt.hashpw(b'tu_contraseña', bcrypt.gensalt(12))
-- ================================================================

INSERT INTO users (user_id, username, password_hash) VALUES (
  '50000001-0000-0000-0000-000000000000',
  'admin',
  '$2b$12$REEMPLAZA_CON_HASH_REAL_GENERADO_CON_BCRYPT'
);


-- ================================================================
-- VERIFICACIÓN (consultas de comprobación)
-- ================================================================
/*
SELECT COUNT(*) AS total_categorias   FROM categories;      -- debe ser 18
SELECT COUNT(*) AS total_subcategorias FROM sub_categories;  -- debe ser 42
SELECT COUNT(*) AS total_productos    FROM products;         -- debe ser 22

-- Productos con precio, categoría y subcategoría
SELECT
  p.product_name,
  p.product_unit_price,
  c.category_name,
  s.sub_category_name,
  p.featured
FROM products p
JOIN categories     c ON c.category_id     = p.category_id
JOIN sub_categories s ON s.sub_category_id = p.sub_category_id
ORDER BY c.sort_order, p.sort_order;
*/
