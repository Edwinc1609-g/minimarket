document.addEventListener('DOMContentLoaded', () => {
    mostrarClientes();
  
  
    const refrescarBtn = document.getElementById("refrescar");
    refrescarBtn.addEventListener('click', mostrarClientes);
  });
  
  function mostrarClientes() {
    
    fetch('/cliente')
      .then(response => response.json())
      .then(data => {
        const tablaCuerpo = document.getElementById('productos-table-body');
        tablaCuerpo.innerHTML = ''; 
  
        if (data.length > 0) {
          data.forEach(cliente => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <td>${cliente.CI || 'N/A'}</td>
              <td>${cliente.cliente_id || 'N/A'}</td>
              <td>${cliente.APELLIDO || 'N/A'}</td>
              <td>${cliente.DIRECCION || 'N/A'}</td>
              <td>${cliente.TELEFONO || 'N/A'}</td>
              <td>${cliente.Correo || 'N/A'}</td>
              <td>
                <button class="btn-editar" onclick="editarCliente(${cliente.CI})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z"/><path fill="white" d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"/></svg></button>
                <button class="btn-eliminar" onclick="eliminarCliente(${cliente.CI})"><svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24"><path fill="white" d="M10 5h4a2 2 0 1 0-4 0M8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0zM14.25 9a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75m-7.516 9.467a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033L18.424 6.5H5.576z"/></svg></button>
              </td>
            `;
            tablaCuerpo.appendChild(fila);
          });
        } else {
          console.log('No se encontraron clientes');
        }
      })
      .catch(error => console.error('Error al cargar los clientes:', error));
  }
const modal = document.getElementById("modal_cliente");
const abrirModalBtn = document.getElementById("buttonAñadir");
const cerrarBtn = document.getElementsByClassName("cerrar")[0];
const cancelarBtn = document.getElementById('cancelar');
const impiarBtn = document.getElementById('limpiar');



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


const agregarclienteBtn = document.getElementById("agregarCliente");
const clienteForm = document.getElementById("productoForm");


agregarclienteBtn.addEventListener("click", function() {
  const CI = document.getElementById("ci").value;
  const cliente_id = document.getElementById("cliente_id").value;
  const apellido = document.getElementById("apellido").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;
  const correo = document.getElementById("correo").value;

  if (!CI || !cliente_id || !apellido || !direccion || !telefono || !correo) {
    swal("Todos los campos con (*) son obligatorios");
    return;
  }

  const nuevoCliente = {
    CI: CI,
    cliente_id: cliente_id,
    APELLIDO: apellido,
    DIRECCION: direccion,
    TELEFONO: telefono,
    Correo: correo
  };

  fetch('/cliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoCliente)
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
    console.log("Cliente agregado:", data);
    swal('Cliente agregado correctamente ', data)
    modal.style.display = "none";
    clienteForm.reset();
    mostrarClientes();
  })
  .catch(error => {
    swal("Error al agregar cliente: " + error.message);
    console.error("Error al agregar cliente:", error);
  });
});

function eliminarCliente(CI) {
  fetch(`/cliente/${CI}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (response.ok) {
          swal('cliente eliminado'); 
          mostrarClientes();
      } else {
          swal('Error al eliminar cliente'); 
      }
  })
  .catch(error => {
    swal("Error al agregar cliente: " + error.message);
    console.error("Error al agregar cliente:", error);
  });
  
}
function editarCliente(ci) {
  fetch(`/cliente/${ci}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener datos del cliente');
      }
      return response.json();
    })
    .then(cliente => {
    
      document.getElementById('ci').value = cliente.CI;
      document.getElementById('cliente_id').value = cliente.cliente_id;
      document.getElementById('apellido').value = cliente.APELLIDO;
      document.getElementById('direccion').value = cliente.DIRECCION;
      document.getElementById('telefono').value = cliente.TELEFONO;
      document.getElementById('correo').value = cliente.Correo;

      document.getElementById('modal_cliente').style.display = 'block';

    
      document.getElementById('agregarCliente').innerText = 'Actualizar cliente';
      document.getElementById('agregarCliente').onclick = function () {
        actualizarCliente(ci);
      };
    })
    .catch(error => {
      console.error('Error:', error);
      swal(error.message); 
    });
}

function actualizarCliente(ci) {
  const clienteActualizado = {
    CI: document.getElementById('ci').value,
    cliente_id: document.getElementById('cliente_id').value,
    APELLIDO: document.getElementById('apellido').value,
    DIRECCION: document.getElementById('direccion').value,
    TELEFONO: document.getElementById('telefono').value,
    Correo: document.getElementById('correo').value,
  };

  fetch(`/cliente/${ci}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clienteActualizado)
  })
  .then(response => {
    if (response.ok) {
      swal('Cliente actualizado correctamente');
      document.getElementById('modal_cliente').style.display = 'none';
      
      document.getElementById('ci').value = '';
      document.getElementById('cliente_id').value = '';
      document.getElementById('apellido').value = '';
      document.getElementById('direccion').value = '';
      document.getElementById('telefono').value = '';
      document.getElementById('correo').value = '';

      mostrarClientes();
      document.getElementById('agregarCliente').innerText = 'Agregar cliente'; 
      document.getElementById('agregarCliente').onclick = agregarCliente;  
    } else {
      swal('Error al actualizar cliente');
    }
  })  
  .catch(error => {
    console.error('Error:', error);
    alert('Error al actualizar el cliente');
  });
}

