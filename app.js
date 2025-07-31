const form = document.getElementById('salidaForm');
    const tableBody = document.querySelector('#historialTable tbody');

    document.addEventListener('DOMContentLoaded', cargarHistorial);
    form.addEventListener('submit', registrarSalida);

    function registrarSalida(e) {
      e.preventDefault();

      const producto = document.getElementById('producto').value;
      const cantidad = parseFloat(document.getElementById('cantidad').value);
      const unidad = document.getElementById('unidad').value;
      const cliente = document.getElementById('cliente').value;
      const fecha = document.getElementById('fecha').value;
      const observaciones = document.getElementById('observaciones').value;

      const salida = { producto, cantidad, unidad, cliente, fecha, observaciones };

      const historial = JSON.parse(localStorage.getItem('historialSalidas')) || [];
      historial.push(salida);
      localStorage.setItem('historialSalidas', JSON.stringify(historial));

      form.reset();
      cargarHistorial();
    }

    function cargarHistorial() {
      tableBody.innerHTML = '';
      const historial = JSON.parse(localStorage.getItem('historialSalidas')) || [];

      historial.forEach((salida, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${salida.producto}</td>
          <td>${salida.cantidad}</td>
          <td>${salida.unidad}</td>
          <td>${salida.cliente}</td>
          <td>${salida.fecha}</td>
          <td>${salida.observaciones || ''}</td>
          <td><button class="delete-btn" onclick="eliminarSalida(${index})">Eliminar</button></td>
        `;

        tableBody.appendChild(row);
      });
    }

    function eliminarSalida(index) {
      const historial = JSON.parse(localStorage.getItem('historialSalidas')) || [];
      historial.splice(index, 1);
      localStorage.setItem('historialSalidas', JSON.stringify(historial));
      cargarHistorial();
    }
    // PARA ENVIAR
    const FORMSPREE_URL = "https://formspree.io/f/mjkoolpb";

function enviarAGoogleSheets() {
  const historial = JSON.parse(localStorage.getItem('historialSalidas')) || [];

  if (historial.length === 0) {
    Swal.fire("No hay datos", "No hay registros para enviar.", "info");
    return;
  }

  // Convertimos cada salida en un bloque de texto
  const cuerpo = historial.map((salida, index) => {
    return `#${index + 1}
Producto: ${salida.producto}
Cantidad: ${salida.cantidad} ${salida.unidad}
Cliente: ${salida.cliente}
Fecha: ${salida.fecha}
Observaciones: ${salida.observaciones || 'Ninguna'}
`;
  }).join('\n-----------------------\n\n');

  Swal.fire({
    title: "Enviando datos por correo...",
    html: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch(FORMSPREE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      _replyto: "no-reply@acuaponia.mx",
      subject: "Registro de Salidas - Acuaponía",
      message: "Se registraron las siguientes salidas:\n\n" + cuerpo
    })
  })
  .then(response => {
    if (!response.ok) throw new Error("Error al enviar el correo");
    return response.json();
  })
  .then(() => {
    Swal.fire("¡Enviado!", "Los datos fueron enviados correctamente por correo.", "success");
    localStorage.removeItem("historialSalidas");
    cargarHistorial();
  })
  .catch(error => {
    console.error("Error al enviar:", error);
    Swal.fire("Error", "No se pudo enviar el correo", "error");
  });
}