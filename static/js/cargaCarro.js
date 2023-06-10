
let productosCarro = [];


 

 window.addEventListener("DOMContentLoaded", () => {
  if(localStorage.getItem("productos")) {
    productosCarro = JSON.parse(localStorage.getItem("productos"))
    actualizarCarro(productosCarro)}  

})
  



function actualizarCarro(listadoProductos){
    localStorage.setItem("productos", JSON.stringify(listadoProductos));

    const valorInicial = 0;
    const sumaProductos = listadoProductos.reduce(
       (acumulador, producto) => acumulador + producto.cantidad, 
       valorInicial

    ); 

    document.querySelector("#cantidad-productos").innerText = sumaProductos;
} 