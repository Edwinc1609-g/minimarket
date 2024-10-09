document.addEventListener('DOMContentLoaded', () => {
    mostrarGastos();
  
    const refrescarBtn = document.getElementById("refrescar");
    refrescarBtn.addEventListener('click', mostrarGastos);
});
  
function mostrarGastos() {
    fetch('/gastos')
        .then(response => response.json())
        .then(data => {
            const tablaCuerpo = document.getElementById('productos-table-body');
            tablaCuerpo.innerHTML = ''; 

            if (data.length > 0) {
                data.forEach(gasto => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${gasto.id || 'N/A'}</td>
                        <td>${gasto.fecha || 'N/A'}</td>
                        <td>${gasto.producto || 'N/A'}</td>
                        <td>${gasto.cantidad || 'N/A'}</td>
                        <td>${gasto.valor || 'N/A'}</td>
                        <td>${gasto.forma_pago || 'N/A'}</td>
                        <td>${gasto.descripcion || 'N/A'}</td>
                        <td>
                        <button class="btn-eliminar" onclick="eliminarGasto(${gasto.id})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"/></svg></button>
                        </td>
                    `;
                    tablaCuerpo.appendChild(fila);
                });
            } else {
                console.log('No se encontraron gastos');
            }
        })
        .catch(error => console.error('Error al cargar los gastos:', error));
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

const agregarGastoBtn = document.getElementById("agregargasto");
const gastoForm = document.getElementById("gastoForm");

agregarGastoBtn.addEventListener("click", function() {
    const fecha = document.getElementById("fecha").value;
    const producto = document.getElementById("producto").value;
    const cantidad = document.getElementById("cantidad").value;
    const valor = document.getElementById("valor").value;
    const forma_pago = document.getElementById("formaPago").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!fecha || !producto || !cantidad || !valor || !forma_pago) {
        swal("Todos los campos con (*) son obligatorios");
        return;
    }

    const nuevoGasto = {
        fecha: fecha,
        producto: producto,
        cantidad: cantidad,
        valor: valor,
        forma_pago: forma_pago,
        descripcion: descripcion
    };

    fetch('/gastos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoGasto)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Gasto agregado:", data);
        swal('Gasto agregado correctamente', data.message);
        modal.style.display = "none";
        gastoForm.reset();
        mostrarGastos();
    })
    .catch(error => {
        swal("Error al agregar gasto: " + error.message);
        console.error("Error al agregar gasto:", error);
    });
});

function eliminarGasto(id) {
    fetch(`/gastos/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el gasto');
            }
            return response.json();
        })
        .then(gasto => {
            const cantidadAEliminar = gasto.cantidad; 

            swal({
                title: '¿Estás seguro?',
                text: 'Una vez eliminado, no podrás recuperar este gasto',
                icon: 'warning',
                buttons: true,
                dangerMode: true
            })
            .then((willDelete) => {
                if (willDelete) {
                    fetch(`/gastos/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (response.ok) {
                            return fetch('/producto/aumentar-stock', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    nombre: gasto.producto, 
                                    cantidad: -cantidadAEliminar 
                                })
                            });
                        } else {
                            throw new Error('Error al eliminar gasto');
                        }
                    })
                    .then(stockResponse => {
                        if (stockResponse.ok) {
                            swal('Gasto eliminado y stock reducido', {
                                icon: 'success',
                            });
                        } else {
                            throw new Error('Error al reducir el stock');
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        swal("Error: " + error.message);
                    })
                    .finally(() => {
                        mostrarGastos(); 
                    });
                }
            });
        })
        .catch(error => {
            console.error("Error al obtener el gasto:", error);
            swal("Error: " + error.message);
        });
}

