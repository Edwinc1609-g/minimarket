document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos();


  const refrescarBtn = document.getElementById("refrescar");
  refrescarBtn.addEventListener('click', mostrarProductos);
});

function mostrarProductos() {
  
  fetch('/producto')
    .then(response => response.json())
    .then(data => {
      const tablaCuerpo = document.getElementById('productos-table-body');
      tablaCuerpo.innerHTML = ''; 

      if (data.length > 0) {
        data.forEach(producto => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${producto.COD_PRODUCTO || 'N/A'}</td>
            <td>${producto.nombre || 'N/A'}</td>
            <td>${producto.marca || 'N/A'}</td>
            <td>${producto.color || 'N/A'}</td>
            <td>${producto.stock || '0'}</td>
            <td>${'$ ' + producto.precio || 'N/A'}</td>
            <td>
              <button class="btn-editar" onclick="editarProducto(${producto.COD_PRODUCTO})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"/><path fill="white" d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"/></svg></button>
              <button class="btn-eliminar" onclick="eliminarProducto(${producto.COD_PRODUCTO})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"/></svg></button>
            </td>
          `;
          tablaCuerpo.appendChild(fila);
        });
      } else {
        console.log('No se encontraron productos');
      }
    })
    .catch(error => console.error('Error al cargar los productos:', error));
}



const modal = document.getElementById("modal");
const abrirModalBtn = document.getElementById("buttonAñadir");
const cerrarBtn = document.getElementsByClassName("cerrar")[0];
const cancelarBtn = document.getElementById('cancelar');



abrirModalBtn.onclick = function() {
  modal.style.display = "block";
}
cancelarBtn.onclick = function() {
  modal.style.display = "none";
}

cerrarBtn.onclick = function() {
  modal.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


const agregarProductoBtn = document.getElementById("agregarProducto");
const productoForm = document.getElementById("productoForm");


agregarProductoBtn.addEventListener("click", function() {
  const nombre = document.getElementById("nombre").value;
  const marca = document.getElementById("marca").value;
  const color = document.getElementById("color").value;
  const stock = document.getElementById("stock").value;
  const precio = document.getElementById("precio").value;

  if (!nombre || !marca || !color || !stock || !precio) {
    swal("Todos los campos con (*) son obligatorios");
    return;
  }

  const nuevoProducto = {
    nombre: nombre,
    marca: marca,
    color: color,
    stock: parseInt(stock),
    precio: parseFloat(precio)
  };

  fetch('/producto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoProducto)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.message);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log("Producto agregado:", data);
    swal('Producto agregado correctamente ', data)
    modal.style.display = "none";
    productoForm.reset();
    mostrarProductos();
  })
  .catch(error => {
    swal("Error al agregar producto: " + error.message);
    console.error("Error al agregar producto:", error);
  });
});

function eliminarProducto(COD_PRODUCTO) {
  swal({
    title: '¿Estás seguro?',
    text: 'Una vez eliminado, no podrás recuperar este producto',
    icon: 'warning',
    buttons: true,
    dangerMode: true
})
  fetch(`/producto/${COD_PRODUCTO}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (response.ok) {
          swal('Producto eliminado'); 
          mostrarProductos();
      } else {
          swal('Error al eliminar producto'); 
      }
  })
  .catch(err => {
      console.error('Error al eliminar el producto:', err); 
      swal('Error al eliminar producto'); 
  });
}
function editarProducto(codProducto) {
  fetch(`/producto/${codProducto}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener el producto');
      }
      return response.json();
    })
    .then(producto => {
    
      document.getElementById('nombre').value = producto.nombre;
      document.getElementById('marca').value = producto.marca;
      document.getElementById('color').value = producto.color;
      document.getElementById('stock').value = producto.stock;
      document.getElementById('precio').value = producto.precio;

    
      document.getElementById('modal').style.display = 'block';

    
      document.getElementById('agregarProducto').innerText = 'Actualizar Producto';
      document.getElementById('agregarProducto').onclick = function () {
        actualizarProducto(codProducto);
      };
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message); 
    });
}

function actualizarProducto(codProducto) {
  const producto = {
    nombre: document.getElementById('nombre').value,
    marca: document.getElementById('marca').value,
    color: document.getElementById('color').value,
    stock: parseInt(document.getElementById('stock').value), 
    precio: parseFloat(document.getElementById('precio').value) 
  };

  fetch(`/producto/${codProducto}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  })
  .then(response => {
    if (response.ok) {
      swal('Producto actualizado');
      document.getElementById('modal').style.display = 'none'; 
      
      document.getElementById('nombre').value = '';
      document.getElementById('marca').value = '';
      document.getElementById('color').value = '';
      document.getElementById('stock').value = '';
      document.getElementById('precio').value = '';

      mostrarProductos();
      document.getElementById('agregarProducto').innerText = 'Agregar Producto'; 
      document.getElementById('agregarProducto').onclick = agregarProducto;

    } else {
      alert('Error al actualizar producto');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al actualizar producto');
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
}