function toggleInputType() {
    const inventario = document.querySelector('input[name="tipo"][value="inventario"]');
    const additionalInputDiv = document.getElementById('additionalInput');
    const buscadorProducto = document.getElementById('buscador_producto');

    if (inventario.checked) {
        additionalInputDiv.style.display = 'none';
        buscadorProducto.style.display = 'block';
    } else {
        additionalInputDiv.style.display = 'block';
        buscadorProducto.style.display = 'none';

    }
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




  function cargarGastos() {
    fetch('/gastos')
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('gastos-table-body');
        tbody.innerHTML = ''; 
  
        data.forEach(gasto => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${gasto.id_gasto}</td>
            <td>${gasto.fecha}</td>
            <td>${gasto.producto}</td>
            <td>${gasto.cantidad}</td>
            <td>${gasto.valor}</td>
            <td>${gasto.formaPago}</td>
            <td>${gasto.descripcion}</td>
          `;
          tbody.appendChild(fila);
        });
      })
      .catch(error => {
        console.error('Error al cargar los gastos:', error);
      });
  }
  
  document.getElementById('refrescar').addEventListener('click', cargarGastos);
  
function seleccionarProducto(producto) {
    document.getElementById('producto').value = producto.NOMBRE; 
    document.getElementById('sugerencias').style.display = 'none'; 
}

function agregarIngreso() {
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const forma_pago = document.querySelector('input[name="tipo"]:checked').value; 
    const descripcion = ''; 

    if (!producto || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const gastoData = {
        fecha: new Date().toISOString().split('T')[0], 
        producto,
        cantidad,
        valor: 0, 
        forma_pago,
        descripcion
    };

 
    fetch('/gastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gastoData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Gasto agregado exitosamente.');

   
        aumentarStock(producto, cantidad);

        document.getElementById('gastoForm').reset();
        document.getElementById('sugerencias').style.display = 'none';
    })
    .catch(err => {
        console.error(err);
        alert('Error al agregar el gasto. Por favor, intenta nuevamente.');
    });
}

function aumentarStock(productoNombre, cantidadAumentar) {
    const aumentoData = {
        nombre: productoNombre,
        cantidad: cantidadAumentar
    };

    fetch('/producto/aumentar-stock', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aumentoData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.nuevoStock !== undefined) {
            console.log(`Nuevo stock para ${productoNombre}: ${data.nuevoStock}`);
        }
    })
    .catch(err => {
        console.error('Error al aumentar el stock:', err);
    });
}


document.getElementById('agregargasto').addEventListener('click', agregarIngreso);

