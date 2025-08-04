create database restaurant_system;
use restaurant_system; 	

INSERT INTO product_stock (id_product_stock, current_stock, ini_stock, total_sold) VALUES
(UUID_TO_BIN(UUID()), 100, 100, 0),
(UUID_TO_BIN(UUID()), 50, 50, 0),
(UUID_TO_BIN(UUID()), 80, 80, 0),
(UUID_TO_BIN(UUID()), 120, 120, 0),
(UUID_TO_BIN(UUID()), 60, 60, 0),
(UUID_TO_BIN(UUID()), 90, 90, 0),
(UUID_TO_BIN(UUID()), 150, 150, 0),
(UUID_TO_BIN(UUID()), 75, 75, 0),
(UUID_TO_BIN(UUID()), 110, 110, 0),
(UUID_TO_BIN(UUID()), 140, 140, 0),
(UUID_TO_BIN(UUID()), 95, 95, 0),
(UUID_TO_BIN(UUID()), 65, 65, 0),
(UUID_TO_BIN(UUID()), 130, 130, 0),
(UUID_TO_BIN(UUID()), 100, 100, 0),
(UUID_TO_BIN(UUID()), 50, 50, 0),
(UUID_TO_BIN(UUID()), 85, 85, 0),
(UUID_TO_BIN(UUID()), 60, 60, 0),
(UUID_TO_BIN(UUID()), 110, 110, 0),
(UUID_TO_BIN(UUID()), 90, 90, 0),
(UUID_TO_BIN(UUID()), 120, 120, 0);

-- Insertar productos
INSERT INTO product (id_product, additional_observation, category, name_product, price, id_admin, id_product_stock) VALUES
(UUID_TO_BIN(UUID()), NULL, 'COMIDA_RAPIDA', 'Hamburguesa Clásica', 12.50, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1)),
(UUID_TO_BIN(UUID()), NULL, 'PASTAS', 'Spaghetti Bolognesa', 14.75, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 1)),
(UUID_TO_BIN(UUID()), NULL, 'CRIOLLOS', 'Arroz Chaufa', 13.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 2)),
(UUID_TO_BIN(UUID()), NULL, 'CRIOLLOS', 'Lomo Saltado', 17.50, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 3)),
(UUID_TO_BIN(UUID()), NULL, 'MARINO', 'Ceviche Mixto', 18.25, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 4)),
(UUID_TO_BIN(UUID()), NULL, 'COMIDA_RAPIDA', 'Pizza Margarita', 15.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 5)),
(UUID_TO_BIN(UUID()), NULL, 'CRIOLLOS', 'Pollo a la Brasa', 16.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 6)),
(UUID_TO_BIN(UUID()), NULL, 'CRIOLLOS', 'Ají de Gallina', 14.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 7)),
(UUID_TO_BIN(UUID()), NULL, 'PASTAS', 'Lasagna de Carne', 15.50, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 8)),
(UUID_TO_BIN(UUID()), NULL, 'BEBIDAS', 'Jugo de Naranja', 5.50, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 9)),
(UUID_TO_BIN(UUID()), NULL, 'BEBIDAS', 'Refresco de Maracuyá', 4.75, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 10)),
(UUID_TO_BIN(UUID()), NULL, 'BEBIDAS', 'Agua Mineral', 3.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 11)),
(UUID_TO_BIN(UUID()), NULL, 'BEBIDAS', 'Café Americano', 4.25, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 12)),
(UUID_TO_BIN(UUID()), NULL, 'BEBIDAS', 'Té de Hierbas', 3.75, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 13)),
(UUID_TO_BIN(UUID()), NULL, 'COMIDA_RAPIDA', 'Tacos de Pollo', 9.50, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 14)),
(UUID_TO_BIN(UUID()), NULL, 'COMIDA_RAPIDA', 'Sandwich de Jamón', 8.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 15)),
(UUID_TO_BIN(UUID()), NULL, 'COMIDA_RAPIDA', 'Wrap Vegetariano', 11.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 16)),
(UUID_TO_BIN(UUID()), NULL, 'CRIOLLOS', 'Tacu Tacu con Lomo', 16.75, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 17)),
(UUID_TO_BIN(UUID()), NULL, 'PASTAS', 'Fetuccini Alfredo', 13.50, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 18)),
(UUID_TO_BIN(UUID()), NULL, 'MARINO', 'Chicharrón de Pescado', 17.00, NULL, (SELECT id_product_stock FROM product_stock LIMIT 1 OFFSET 19));

select * from product;

-- Insertar stock para los productos
-- Usamos UUID_TO_BIN para generar ids únicos para el stock
