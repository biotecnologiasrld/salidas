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
    
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwwSLOH4qw3Pu8pm3Vbg3P3VWoNPnngWIjdlwPmQe4iGZLP0U7uFDlwLNuB-4Bna8BU/exec";

function enviarAGoogleSheets() {
  const historial = JSON.parse(localStorage.getItem('historialSalidas')) || [];

  if (historial.length === 0) {
    Swal.fire("No hay datos", "No hay registros para enviar.", "info");
    return;
  }

  Swal.fire({
    title: "Enviando datos...",
    html: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch(GOOGLE_SHEETS_URL, {
    method: "POST",
    body: JSON.stringify(historial),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("La respuesta no fue OK");
    }
    return response.text(); // o response.json() si tu script responde JSON
  })
  .then(data => {
    Swal.fire("¡Enviado!", "Los datos fueron enviados correctamente a Google Sheets.", "success");
    localStorage.removeItem("historialSalidas");
    cargarHistorial();
  })
  .catch(error => {
    console.error("Error al enviar:", error);
    Swal.fire("Error", "No se pudo enviar a Google Sheets", "error");
  });
}
