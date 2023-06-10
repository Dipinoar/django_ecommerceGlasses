let productosCarro = [];

function main() {
  try {
    productosCarro = JSON.parse(localStorage.getItem("productos")) || [];
    actualizarCarro(productosCarro);
    //cargarProductos(productos);
  } catch (error) {
    localStorage.setItem("productos", JSON.stringify([]));
    productosCarro = JSON.parse(localStorage.getItem("productos"));
    actualizarCarro(productosCarro);
    //cargarProductos(productos);
  }
}

main();



function addToCart(sku) {
  let objProducto = {
    sku,
    cantidad: 1,
  };

  let productoEncontrado = productosCarro.find(
    (producto) => producto.sku == sku
  );

  if (productoEncontrado) {
    productoEncontrado.cantidad = productoEncontrado.cantidad + 1;
  } else {
    productosCarro.push(objProducto);
  }
  
  actualizarCarro(productosCarro);

}

function actualizarCarro(listadoProductos) {
  localStorage.setItem("productos", JSON.stringify(listadoProductos));

  const valorInicial = 0;
  const sumaProductos = listadoProductos.reduce(
    (acumulador, producto) => acumulador + producto.cantidad,
    valorInicial
  );
  document.querySelector("#cantidad-productos").innerText = sumaProductos;
  disabledBoton(listadoProductos)
}

function disabledBoton(productosCarro){
  productosCarro.forEach( producto=> {
    let boton=document.querySelector(`[data-sku="${producto.sku}"]`)
    boton.className = "btn disabled"
    boton.innerHTML="¡Agregado al carrito!"})}

