-- Insert categories
INSERT INTO public.categories (name, slug, display_order) VALUES
('Service à Thé', 'service-a-the', 1),
('Vaisselle', 'vaisselle', 2),
('Électroménager', 'electromenager', 3),
('Décoration', 'decoration', 4),
('Rangement', 'rangement', 5);

-- Insert products with category references
INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Service à Thé Doré 6 Personnes', c.id, 25000, 'Service complet avec théière et 6 verres dorés', true, '/products/service-the-dore.jpg'
FROM public.categories c WHERE c.slug = 'service-a-the';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Théière Traditionnelle Marocaine', c.id, 15000, 'Théière artisanale en inox avec finitions dorées', true, '/products/theiere-marocaine.jpg'
FROM public.categories c WHERE c.slug = 'service-a-the';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Verres à Thé Dorés (Lot de 6)', c.id, 8000, 'Verres traditionnels avec motifs dorés', true, '/products/verres-the-dores.jpg'
FROM public.categories c WHERE c.slug = 'service-a-the';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Plateau de Service Argenté', c.id, 18000, 'Grand plateau oval pour service à thé', true, '/products/plateau-argente.jpg'
FROM public.categories c WHERE c.slug = 'service-a-the';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Set d''Assiettes 12 Pièces', c.id, 35000, 'Assiettes plates et creuses en porcelaine blanche', true, '/products/set-assiettes.jpg'
FROM public.categories c WHERE c.slug = 'vaisselle';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Plats de Service (Lot de 3)', c.id, 22000, 'Plats ovales de différentes tailles', true, '/products/plats-service.jpg'
FROM public.categories c WHERE c.slug = 'vaisselle';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Bols à Soupe (Lot de 6)', c.id, 12000, 'Bols traditionnels pour soupe et thiéré', true, '/products/bols-soupe.jpg'
FROM public.categories c WHERE c.slug = 'vaisselle';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Set de Couverts 24 Pièces', c.id, 28000, 'Couverts en inox avec finition dorée', true, '/products/set-couverts.jpg'
FROM public.categories c WHERE c.slug = 'vaisselle';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Blender 3 Vitesses 1.5L', c.id, 35000, 'Parfait pour jus de fruits et smoothies', true, '/products/blender.jpg'
FROM public.categories c WHERE c.slug = 'electromenager';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Bouilloire Électrique Inox', c.id, 18000, 'Bouilloire 1.7L avec arrêt automatique', true, '/products/bouilloire.jpg'
FROM public.categories c WHERE c.slug = 'electromenager';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Friteuse Électrique 3L', c.id, 45000, 'Friteuse avec thermostat réglable', true, '/products/friteuse.jpg'
FROM public.categories c WHERE c.slug = 'electromenager';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Cuiseur à Riz 1.8L', c.id, 25000, 'Cuiseur automatique avec fonction maintien au chaud', true, '/products/cuiseur-riz.jpg'
FROM public.categories c WHERE c.slug = 'electromenager';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Mixeur Plongeant', c.id, 15000, 'Mixeur puissant avec accessoires', true, '/products/mixeur-plongeant.jpg'
FROM public.categories c WHERE c.slug = 'electromenager';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Lanterne Décorative LED', c.id, 12000, 'Lanterne style oriental avec LED intégrée', true, '/products/lanterne-led.jpg'
FROM public.categories c WHERE c.slug = 'decoration';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Nappe Festive Brodée', c.id, 20000, 'Nappe élégante avec broderies dorées', true, '/products/nappe-brodee.jpg'
FROM public.categories c WHERE c.slug = 'decoration';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Set de Table (Lot de 6)', c.id, 8000, 'Sets de table assortis avec motifs', true, '/products/sets-table.jpg'
FROM public.categories c WHERE c.slug = 'decoration';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Bougies Parfumées (Lot de 3)', c.id, 10000, 'Bougies parfum oud et musc', true, '/products/bougies-parfumees.jpg'
FROM public.categories c WHERE c.slug = 'decoration';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Boîtes de Conservation (Set de 5)', c.id, 15000, 'Boîtes hermétiques pour dattes et pâtisseries', true, '/products/boites-conservation.jpg'
FROM public.categories c WHERE c.slug = 'rangement';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Thermos 2L Inox', c.id, 22000, 'Thermos grande capacité garde au chaud 24h', true, '/products/thermos.jpg'
FROM public.categories c WHERE c.slug = 'rangement';

INSERT INTO public.products (name, category_id, price, description, in_stock, image_url)
SELECT 'Distributeur de Jus 5L', c.id, 28000, 'Distributeur avec robinet pour bissap et bouye', true, '/products/distributeur-jus.jpg'
FROM public.categories c WHERE c.slug = 'rangement';