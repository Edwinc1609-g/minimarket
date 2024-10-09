
var carritoVisible = false;


if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {

    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }


    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }


    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);

    mostrarProductos();
}

function pagarClicked() {
    swal({
        title: "¿Seguro que quieres registrar la venta?",
        text: "Una vez confirmada, la venta será registrada.",
        icon: "warning",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: true,
    }).then((willRegister) => {
        if (willRegister) {
            const carritoItems = document.getElementsByClassName('carrito-item');
            const ingresos = [];
            const forma_de_pago = document.querySelector('input[name="formaPago"]:checked').value;
            const descripcion = document.getElementById('descripcion').value;


            const fecha = new Date();
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
            const anio = String(fecha.getFullYear()).slice(-2); 
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            for (let item of carritoItems) {
                const producto = item.querySelector('.carrito-item-titulo').textContent;
                const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
                const precio = parseFloat(item.querySelector('.carrito-item-precio').textContent.replace(/[$.]/g, '').replace(',', ''));

                const ingreso = {
                    producto: producto,
                    cantidad: cantidad,
                    descripcion: descripcion || '',
                    valor: precio * cantidad,
                    formaDePago: forma_de_pago,
                    fecha: fechaFormateada 
                };

                ingresos.push(ingreso);
            }

            
            ingresos.forEach(ingreso => {
                
                fetch('/ingresos/registrarIngreso', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ingreso)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en el registro del ingreso');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Registro de ingreso exitoso:', data);

                    
                    fetch('/productos/reducirStock', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            producto: ingreso.producto,
                            cantidad: ingreso.cantidad
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al reducir el stock');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Stock reducido correctamente:', data);
                    })
                    .catch(error => {
                        console.error('Error al reducir el stock:', error);
                    });
                })
                .catch(error => {
                    console.error('Error al registrar el ingreso:', error);
                });
            });

            
            const carritoItemsDiv = document.getElementsByClassName('carrito-items')[0];
            while (carritoItemsDiv.hasChildNodes()) {
                carritoItemsDiv.removeChild(carritoItemsDiv.firstChild);
            }

            actualizarTotalCarrito();
            ocultarCarrito();

            swal("Gracias por la compra", {
                icon: "success",
            });
        } else {
            swal("Registro de venta cancelado.");
        }
    });
}




function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    
    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}


function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}


function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var item = document.createElement('div');
    item.classList.add('item'); 

    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText == titulo) {
            swal("El item ya se encuentra en el carrito");
            return;
        }
    }

    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

   
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);


    actualizarTotalCarrito();
}


function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}


function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}


function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}


function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}


function actualizarTotalCarrito() {
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = parseInt(cantidadItem.value);
        total += precio * cantidad;
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";
}



function mostrarProductos() {
    fetch('/producto')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const contenedorProductos = document.querySelector('.contenedor-items');
            if (!contenedorProductos) {
                console.error('El contenedor de productos no existe en el DOM');
                return;
            }

            contenedorProductos.innerHTML = '';

            data.forEach(producto => {
                const productoHTML = `
                    <div class="item">
                        <span class="titulo-item">${producto.nombre}</span>
                        <img src="img/icono.png" alt="" class="img-item">
                        <span class="precio-item">$${producto.precio}</span>
                        <button class="boton-item">Agregar al Carrito</button>
                    </div>
                `;
                contenedorProductos.innerHTML += productoHTML;
            });

            const botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
            for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
                botonesAgregarAlCarrito[i].addEventListener('click', agregarAlCarritoClicked);
            }
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}
let debounceTimeout;

function buscarProducto() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const nombreProducto = document.getElementById('producto').value;

        if (nombreProducto.length > 0) {
            fetch(`/producto/buscar?nombre=${encodeURIComponent(nombreProducto)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Datos recibidos:', data); 
                    const sugerencias = document.getElementById('sugerencias');
                    sugerencias.innerHTML = ''; 
                    sugerencias.style.display = 'block'; 

                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(producto => {
                            const div = document.createElement('div');
                            div.textContent = producto.NOMBRE; 
                            div.addEventListener('click', () => {
                                seleccionarProducto(producto); 
                            });
                            sugerencias.appendChild(div);
                        });
                    } else {
                        sugerencias.innerHTML = '<div>No se encontraron productos.</div>';
                    }
                })
                .catch(error => {
                    console.error('Error al buscar productos:', error);
                });
        } else {
            document.getElementById('sugerencias').style.display = 'none'; 
        }
    }, 300); 
}

function seleccionarProducto(producto) {
    document.getElementById('producto').value = producto.NOMBRE;
    document.getElementById('sugerencias').style.display = 'none';

    agregarItemAlCarrito(producto.NOMBRE, `$${producto.PRECIO}`, 'img/icono.png');
    hacerVisibleCarrito();
}

