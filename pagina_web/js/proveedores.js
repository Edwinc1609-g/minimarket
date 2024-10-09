document.addEventListener('DOMContentLoaded', () => {
    mostrarProveedores();

    const refrescarBtn = document.getElementById('refrescar');
    refrescarBtn.addEventListener('click', mostrarProveedores);
});

function mostrarProveedores() {
    fetch('/proveedor')
        .then(response => response.json())
        .then(data => {
            const tablaCuerpo = document.getElementById('proveedores-table-body');
            tablaCuerpo.innerHTML = '';

            if (data.length > 0) {
                data.forEach(proveedor => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${proveedor.id_proveedor || 'N/A'}</td>
                        <td>${proveedor.nombre || 'N/A'}</td>
                        <td>${proveedor.direccion || 'N/A'}</td>
                        <td>${proveedor.telefono || 'N/A'}</td>
                        <td>${proveedor.correo || 'N/A'}</td>
                        <td>
                          <button class="btn-editar" onclick="editarProveedor(${proveedor.id_proveedor})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"/><path fill="white" d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"/></svg></button>
                          <button class="btn-eliminar" onclick="eliminarProveedor(${proveedor.id_proveedor})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"/></svg></button>
                        </td>
                    `;
                    tablaCuerpo.appendChild(fila);
                });
            } else {
                console.log('No se encontraron proveedores');
            }
        })
        .catch(error => console.error('Error al cargar los datos de los proveedores: ', error));
}

const modal = document.getElementById('modal_proveedor');
const abrirModalBtn = document.getElementById('buttonAñadir');
const cerrarBtn = document.getElementsByClassName('cerrar')[0];
const cancelarBtn = document.getElementById('cancelar');

abrirModalBtn.onclick = function () {
    modal.style.display = 'block';
};
cancelarBtn.onclick = function () {
    modal.style.display = 'none';
};
cerrarBtn.onclick = function () {
    modal.style.display = 'none';
};
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

const agregarProveedorBtn = document.getElementById('agregarProveedor');
const proveedorForm = document.getElementById('proveedorForm');

agregarProveedorBtn.addEventListener('click', function () {
    const id_proveedor = document.getElementById('proveedor_id').value;
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;

    if (!id_proveedor || !nombre || !direccion || !telefono || !correo) {
        swal('Todos los campos con (*) son obligatorios');
        return;
    }

    const nuevoProveedor = {
        id_proveedor: id_proveedor,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        correo: correo
    };

    fetch('/proveedor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProveedor)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                try {
                    const errorJson = JSON.parse(text);
                    throw new Error(errorJson.message);
                } catch (e) {
                    throw new Error(text); 
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Proveedor agregado: ', data);
        swal('Proveedor agregado correctamente: ', data);
        modal.style.display = 'none';
        proveedorForm.reset();
        mostrarProveedores();
    })
    .catch(error => {
        swal('Error al agregar el proveedor: ' + error.message);
        console.error('Error al agregar proveedor:', error);
    });
});

function editarProveedor(id_proveedor) {
    fetch(`/proveedor/${id_proveedor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el proveedor');
            }
            return response.json();
        })
        .then(proveedor => {
            document.getElementById('id_proveedor').value = proveedor.id_proveedor;
            document.getElementById('nombre').value = proveedor.nombre;
            document.getElementById('direccion').value = proveedor.direccion;
            document.getElementById('telefono').value = proveedor.telefono;
            document.getElementById('correo').value = proveedor.correo;

            document.getElementById('modal_proveedor').style.display = 'block';
            document.getElementById('agregarProveedor').innerText = 'Actualizar Proveedor';
            document.getElementById('agregarProveedor').onclick = function () {
                actualizarProveedor(id_proveedor);
            };
        })
        .catch(error => {
            console.error('Error:', error);
            swal(error.message);
        });
}

function actualizarProveedor(id_proveedor) {
    const proveedor = {
        id_proveedor: document.getElementById('proveedor_id').value,
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
    };

    fetch(`/proveedor/${id_proveedor}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    })
        .then(response => {
            if (response.ok) {
                swal('Proveedor actualizado');
                document.getElementById('modal_proveedor').style.display = 'none';
                proveedorForm.reset();
                mostrarProveedores();
            } else {
                throw new Error('Error al actualizar proveedor');
            }
        })
        .catch(error => {
            console.error('Error al actualizar proveedor:', error);
            swal('Error al actualizar proveedor');
        });
}

function eliminarProveedor(id_proveedor) {
    swal({
        title: '¿Estás seguro?',
        text: 'Una vez eliminado, no podrás recuperar este proveedor',
        icon: 'warning',
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            fetch(`/proveedor/${id_proveedor}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        swal('Proveedor eliminado con éxito');
                        mostrarProveedores();
                    } else {
                        throw new Error('Error al eliminar proveedor');
                    }
                })
                .catch(error => {
                    console.error('Error al eliminar proveedor:', error);
                    swal('Error al eliminar proveedor');
                });
        }
    });
}
