document.addEventListener('DOMContentLoaded', () => {
    mostraringresos();
  
    const refrescarBtn = document.getElementById("refrescar");
    refrescarBtn.addEventListener('click', mostraringresos);
});
  
function mostraringresos() {
    fetch('/ingresos')
        .then(response => response.json())
        .then(data => {
            const tablaCuerpo = document.getElementById('ingresos-table-body');
            tablaCuerpo.innerHTML = ''; 
  
            if (data.length > 0) {
                data.forEach(ingreso => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${ingreso.id_ingreso || 'N/A'}</td>
                        <td>${ingreso.fecha || 'N/A'}</td>
                        <td>${ingreso.producto || 'N/A'}</td>
                        <td>${ingreso.cantidad || 'N/A'}</td>
                        <td>${'$ ' + ingreso.valor || 'N/A'}</td>
                        <td>${ingreso.forma_de_pago || 'N/A'}</td>
                        <td>${ingreso.descripcion || 'N/A'}</td>

                        <td>
                             <button class="btn-editar" onclick="editarIngreso(${ingreso.id_ingreso})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"/><path fill="white" d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"/></svg></button>
                             <button class="btn-eliminar" onclick="eliminarIngreso(${ingreso.id_ingreso})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"/></svg></button>
                        </td>
                    `;
                    tablaCuerpo.appendChild(fila);
                });
            } else {
                console.log('No se encontraron ingresos');
            }
        })
        .catch(error => console.error('Error al cargar los ingresos:', error));
}
  
const modal = document.getElementById("modal");
const abrirModalBtn = document.getElementById("buttonAñadir");
const cerrarBtn = document.getElementsByClassName("cerrar")[0];
const cancelarBtn = document.getElementById('cancelar');
  
abrirModalBtn.onclick = function() {
    modal.style.display = "block";
};
  
cancelarBtn.onclick = function() {
    modal.style.display = "none";
};
  
cerrarBtn.onclick = function() {
    modal.style.display = "none";
};
  
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function obtenerFechaActual() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0'); 
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const año = String(fecha.getFullYear()).slice(-2);
    return `${dia}/${mes}/${año}`; 
}
window.onload = function() {
    document.getElementById("fecha").value = obtenerFechaActual();
};

  
const agregarProductoBtn = document.getElementById("agregaringreso");
const ingresoForm = document.getElementById("ingresoForm");
  
agregarProductoBtn.addEventListener("click", function() {
    const fecha = document.getElementById("fecha").value;
    const producto = document.getElementById("producto").value;
    const cantidad = document.getElementById("cantidad").value;
    const valor = document.getElementById("valor").value;
    const formaPago = document.getElementById("formaPago").value;
    const descripcion = document.getElementById("descripcion").value;
  
    if (!producto || !cantidad || !valor || !formaPago || !descripcion) {
        swal("Todos los campos con (*) son obligatorios");
        return;
    }
  
    const nuevoIngreso = {
        fecha: fecha,
        producto: producto,
        cantidad: cantidad,
        valor: valor,
        forma_de_pago: formaPago,
        descripcion: descripcion
    };
    console.log("Nuevo ingreso a registrar:", nuevoIngreso);
  
    fetch('/registrarIngreso', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoIngreso)
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
        console.log("Ingreso agregado:", data);
        swal('Ingreso agregado correctamente', data);
        modal.style.display = "none";
        ingresoForm.reset();
        mostraringresos();
    })
    .catch(error => {
        swal("Error al agregar el ingreso: " + error.message);
        console.error("Error al agregar el ingreso:", error);
    });
});
  
function eliminarIngreso(id_ingreso) {
    swal({
        title: '¿Estás seguro?',
        text: 'Una vez eliminado, no podrás recuperar este ingreso',
        icon: 'warning',
        buttons: true,
        dangerMode: true
    })
    .then((willDelete) => {
        if (willDelete) {
            fetch(`/ingresos/${id_ingreso}`)
            .then(response => response.json())
            .then(data => {
                const producto = data.producto;  
                const cantidad = data.cantidad; 

                fetch('/producto/aumentar-stock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: producto,  
                        cantidad: cantidad 
                    })
                })
                
                .then(response => response.json())
                .then(() => {
                    return fetch(`/ingresos/${id_ingreso}`, {
                        method: 'DELETE'
                    });
                })
                .then(response => {
                    if (response.ok) {
                        swal('Ingreso eliminado y stock actualizado');
                        mostraringresos();  
                    } else {
                        swal('Error al eliminar ingreso');
                    }
                })
                .catch(err => {
                    console.error('Error al procesar la eliminación del ingreso:', err);
                    swal('Error al procesar la eliminación del ingreso');
                });
            })
            .catch(err => {
                console.error('Error al obtener los detalles del ingreso:', err);
                swal('Error al obtener los detalles del ingreso');
            });
        }
    });
}

  
function editarIngreso(id_ingreso) {
    fetch(`/ingresos/${id_ingreso}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el registro de ingreso');
            }
            return response.json();
        })
        .then(ingresos => {
            document.getElementById('fecha').value = ingresos.fecha;
            document.getElementById('producto').value = ingresos.producto;
            document.getElementById('cantidad').value = ingresos.cantidad;
            document.getElementById('valor').value = ingresos.valor;
            document.getElementById('formaPago').value = ingresos.forma_de_pago;
            document.getElementById('descripcion').value = ingresos.descripcion;
  
            document.getElementById('modal').style.display = 'block';
            document.getElementById('agregaringreso').innerText = 'Actualizar registro';
            document.getElementById('agregaringreso').onclick = function() {
                actualizarIngreso(id_ingreso);
            };
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
}
  
function actualizarIngreso(id_ingreso) {
    const ingreso = {
        fecha: document.getElementById('fecha').value,
        producto: document.getElementById('producto').value,
        cantidad: document.getElementById('cantidad').value,
        valor: parseFloat(document.getElementById('valor').value),
        forma_de_pago: document.getElementById('formaPago').value,
        descripcion: document.getElementById('descripcion').value
    };
  
    fetch(`/ingresos/${id_ingreso}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingreso)
    })
    .then(response => {
        if (response.ok) {
            swal('Registro actualizado');
            document.getElementById('modal').style.display = 'none';
            mostraringresos();
            document.getElementById('agregaringreso').innerText = 'Agregar ingreso';
            document.getElementById('agregaringreso').onclick = agregaringreso;
        } else {
            alert('Error al actualizar registro');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar registro');
    });
}
