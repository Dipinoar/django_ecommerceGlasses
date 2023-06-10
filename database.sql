-- Crear la tabla 'compra'
CREATE TABLE compra (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    detallepago_id INTEGER
);

-- Crear la tabla 'detalle_compra'
CREATE TABLE detalle_compra (
    id SERIAL PRIMARY KEY,
    producto_sku INTEGER,
    cantidad_compra INTEGER,
    compra_id INTEGER,
    FOREIGN KEY (producto_sku) REFERENCES products(sku),
    FOREIGN KEY (compra_id) REFERENCES compra(id)
);

-- Crear la tabla 'products'
CREATE TABLE products (
    sku SERIAL PRIMARY KEY,
    nombre TEXT,
    descripcion TEXT,
    precio INTEGER,
    descuento INTEGER,
    imagen TEXT,
    stock INTEGER
);
