let cupones = [
  {
    nombre: "conveniocaja",
    descuento: 6,
    estado: true,
  },
  {
    nombre: "conveniocaja15",
    descuento: 15,
    estado: true,
  },
  {
    nombre: "convenioadultomayor",
    descuento: 25,
    estado: true,
  },
];


function revisarDisponibilidad(products){
    productosCarro.forEach((productoStorage) => {
      products.filter((producto) => {
       if (
         producto.sku == productoStorage.sku &&
         productoStorage.cantidad > producto.stock
       ) {
         productoStorage.cantidad = producto.stock;
       }
     });
     localStorage.setItem("productos", JSON.stringify(productosCarro));
    })
    return productosCarro  
} 
 
async function getProducts(){
  return fetch("http://localhost:8000/api/apiProductos")
  .then(response => { return response.json()})
  .then(data => {return products=data});
  } 
  

let productosCarro = [];
let precioTotalCompra = 0;
let products=[]
 
 

 window.addEventListener("DOMContentLoaded", () => {
  if(localStorage.getItem("productos")) {
    productosCarro = JSON.parse(localStorage.getItem("productos"))
    /* products=getProducts()
    revisarDisponibilidad(products)
    actualizarCarro(productosCarro)
    cargarTablaProductos() */
   
    getProducts()
    .then(()=>{revisarDisponibilidad(products)})
    .then(()=>{actualizarCarro(productosCarro)})   
    .then(()=>{cargarTablaProductos()}) 
} 
  else{cargarTablaProductos()}
}); 



function actualizarCarro(listadoProductos){
    localStorage.setItem("productos", JSON.stringify(listadoProductos));

    const valorInicial = 0;
    const sumaProductos = listadoProductos.reduce(
       (acumulador, producto) => acumulador + producto.cantidad, 
       valorInicial

    );
    if( document.querySelector("#cantidad-productos")){
    document.querySelector("#cantidad-productos").innerText = sumaProductos;}
} 


function cargarTablaProductos(data) {
    let acumuladorFilas = "";

    precioTotalCompra = 0; 
    productosCarro.forEach((producto, index) => {
        let productoConDetalles = encontrarProducto(producto.sku); 
        let precioUnitario =         productoConDetalles.precio - productoConDetalles.descuento; 
        let totalProducto = producto.cantidad * precioUnitario;
        precioTotalCompra += totalProducto;


        //ARMANDO TABLA
       let template = `
              <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${productoConDetalles.sku}</td>
                  <td>${productoConDetalles.nombre}</td>
                  <td>${productoConDetalles.precio}</td>
                  <td>${productoConDetalles.descuento}</td>
                  <td>${precioUnitario}</td>
                  <td>
                    <button onclick="restar('${productoConDetalles.sku}')">-</button>
                    <input type="number" value=${producto.cantidad} style="width:30px;">
                    <button onclick="sumar('${productoConDetalles.sku}')">+</button>
                  </td>
                  <td>${totalProducto}</td>
              </tr>
      `;
      acumuladorFilas += template;
    });

    document.querySelector("#productos-carrito tbody").innerHTML =
    acumuladorFilas;
  document.querySelector(
    "#precio-total"
  ).innerHTML = `El precio total de la compra es: <strong>$${precioTotalCompra}</strong>`;
}

function encontrarProducto(sku) {
  const resultado = products.filter(producto => producto.sku == sku);
  return resultado[0]
}

//LÓGICA VACIAR CARRITO
document
  .getElementById("btn-vaciar")
  .addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.setItem("productos", "[]");
    location.reload();
  });

//LÓGICA DESCUENTO POR CUPÓN
document.getElementById("btn-descuento").addEventListener("click", function (event) {
    let cuponIngresado = document.getElementById("input-cupon").value;

    let cuponEncontrado = cupones.find(
      (cupon) => cupon.nombre == cuponIngresado
    );


    if (cuponEncontrado && cuponEncontrado.estado == true) {
      alert("cupón encontrado.");
      precioTotalCompra =
        precioTotalCompra -
        (precioTotalCompra * cuponEncontrado.descuento) / 100;
      document.querySelector(
        "#precio-total"
      ).innerHTML = `El precio total de la compra con descuento es: <strong>$${precioTotalCompra}</strong>`;
      cuponEncontrado.estado = false;
    } else {
      alert("El cupón no existe. / o está caducado");
    }
  });


  //RESTAR PRODUCTOS

  function restar(sku){
    productosCarro.forEach((producto, index) => {
      if(sku == producto.sku){
        producto.cantidad = producto.cantidad - 1;
        if(producto.cantidad <= 0){
          if(confirm("Está seguro que desea eliminar?")){
            productosCarro.splice(index, 1)
          }else{
            producto.cantidad =1;
          }
        }
      }
    })
    actualizarCarro(productosCarro);
    cargarTablaProductos();
  }

  //SUMAR PRODUCTOS

  function sumar(sku){
    let productoEncontrado=encontrarProducto(sku)
    productosCarro.forEach((producto, index) => {
      if(sku == producto.sku && productoEncontrado.stock>producto.cantidad ){
        producto.cantidad = producto.cantidad + 1;
      }
      else if(sku == producto.sku && productoEncontrado.stock==producto.cantidad){
        producto.cantidad =productoEncontrado.stock;
        alert(`Stock disponible de ${productoEncontrado.stock} unidades`)
      }
    })
    actualizarCarro(productosCarro);
    cargarTablaProductos();
  }




//LÓGICA DE COMPRA
document.getElementById("boton-pagar").addEventListener("click", function (event) {
  if (window.location.pathname=="/dashboard"){
    if(productosCarro.length>0){
        Swal.fire({
          title: 'Confirmar compra',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Realizar compra!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Compra realizada',
              'Gracias por tu compra!',
              'success'
            )
            .then(()=>{
              return fetch("http://localhost:8000/cart/compraYDetalle", {
                method: 'POST', 
                headers: {'Content-Type': 'application/json',
                'X-CSRFToken': getCookie("csrftoken")},
                body: JSON.stringify(productosCarro)   
                })})
              .then(()=>{
                localStorage.clear()
               setTimeout(function(){location.href="http://localhost:8000/"} , 4000);
              })
          }
        })
       }}
  else{ 
    Swal.fire({
      title:"Ingresa a tu cuenta",
     icon:'info',
     showConfirmButton: false,
     timer: 800
    }).then(()=>{
    window.location = "/login"
    })

  }

   })

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
       var c = ca[i];
       while (c.charAt(0)==' ') c = c.substring(1);
       if(c.indexOf(name) == 0)
          return c.substring(name.length,c.length);
    }
    return "";
}