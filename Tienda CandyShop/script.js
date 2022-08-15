Swal.fire("Bienvenidos a CandyShop");

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carritoDeCompras");
const botonVaciar = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotal = document.getElementById("precioTotal");
const confirmCompra = document.querySelector(`#comprarCarrito`);
let carrito = [];

//-----------------Funciones-------------------
function actualizarCarrito() {
  contenedorCarrito.innerHTML = "";
  carrito.forEach((prod) => {
    let { id, cantidad } = prod;

    const div = document.createElement("div");
    div.className = "productoEnCarrito";
    div.innerHTML = `
    <p>${prod.nombre}</p>
    <p>$${prod.precio}</p>
    <p>Cantidad : <span id="cantidad">${cantidad}</span></p>
    <button onclick = "eliminarDelCarrito(${id})" class="boton-eliminar"><i class="bi-trash3"></i></button>
    `;
    contenedorCarrito.appendChild(div);

    localStorage.setItem("carrito", JSON.stringify(carrito));
  });
  contadorCarrito.innerText = carrito.length;
  precioTotal.innerText = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );
}
function eliminarDelCarrito(prodId) {
  const item = carrito.find((prod) => prod.id === prodId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  actualizarCarrito();
}
function vaciarCarrito() {
  botonVaciar.addEventListener("click", () => {
    carrito.length = [];
    localStorage.clear();
    actualizarCarrito();
    Swal.fire({
      title: "El Carrito se vació con éxito",
      position: "center",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  });
}
function confirmarCompra() {
  confirmCompra.addEventListener("click", () => {
    if (localStorage.getItem("carrito") == null || carrito.length == 0) {
      Swal.fire("No hay productos en el carrito", "", "warning");
    } else {
      Swal.fire({
        title: "¿Está seguro/a de realizar la compra?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Realizar compra!",
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            "Compra realizada!",
            "Muchas Gracias! Vuelva Pronto",
            "success"
          );
          carrito.length = [];
          localStorage.clear();
          actualizarCarrito();
        }
      });
    }
  });

  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    actualizarCarrito();
  }
}
//--------------------------------------------

//-----------------Código principal-----------------
fetch("productos.json")
  .then((response) => response.json())
  .then((stockDeProductos) => {
    stockDeProductos.forEach((producto) => {
      let { img, nombre, precio, id, cantidad } = producto;
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
    <div class="card cardTienda" style="width: 18rem; margin: 5px;">
        <img src=${img} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">$${precio}</p>
            <button id="agregar${id}" class="buttonAgregar">Agregar al Carrito</button>
        </div>
    </div>
    `;
      contenedorProductos.appendChild(div);
      const boton = document.getElementById(`agregar${id}`);

      boton.addEventListener("click", () => {
        agregarAlCarrito(id);
      });
    });

    const agregarAlCarrito = (prodId) => {
      const existe = carrito.some((prod) => prod.id === prodId);
      if (existe) {
        const prod = carrito.map((prod) => {
          if (prod.id === prodId) {
            prod.cantidad++;
            Toastify({
              text: "Nueva Cantidad Agregada al carrito",
              duration: 2000,
              newWindow: true,
              close: false,
              gravity: "top", // `top` or `bottom`
              position: "center", // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              style: {
                background: "linear-gradient(to left, #00b09b, #96c93d)",
              },
              onClick: function () {}, // Callback after click
            }).showToast();
          }
        });
      } else {
        
        const item = stockDeProductos.find((prod) => prod.id === prodId);
        carrito.push(item);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Producto agregado al Carrito",
          showConfirmButton: false,
          timer: 1500,
        }); 
      }
      actualizarCarrito();
    };

    eliminarDelCarrito();

    vaciarCarrito();

    confirmarCompra();
  });
