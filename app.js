// 📅 FUNCIÓN FECHA LOCAL SEGURA
function obtenerFechaHoy() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 📅 Fecha automática
const inputFecha = document.getElementById("fecha");
if (inputFecha) {
  inputFecha.value = obtenerFechaHoy();
}

// 📅 Formatear fecha bonita
function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const partes = fecha.split("-");
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  return `${parseInt(partes[2])} ${meses[parseInt(partes[1]) - 1]} ${partes[0]}`;
}

// 📦 Datos
let viajes = JSON.parse(localStorage.getItem("viajes")) || [];
let viajesMostrados = [];

const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");

// 🚀 INICIO
mostrarHoy();

// 📝 Guardar viaje
formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const cliente = document.getElementById("cliente").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const estado = document.getElementById("estado").value;
  const fecha = document.getElementById("fecha").value;

  if (!cliente) return alert("Ingrese un cliente");
  if (isNaN(precio)) return alert("Precio inválido");

  const viaje = { cliente, precio, estado, fecha };

  viajes.push(viaje);
  guardar();
  mostrarHoy();

  formulario.reset();
  inputFecha.value = obtenerFechaHoy();
});

// 💾 Guardar
function guardar() {
  localStorage.setItem("viajes", JSON.stringify(viajes));
}

// 📋 Crear item
function crearItem(v, index) {
  const li = document.createElement("li");

  li.innerHTML = `
    📅 ${formatearFecha(v.fecha)} <br>
    👤 ${v.cliente} - 💰 $${v.precio}
    <strong>(${v.estado})</strong>
  `;

  li.style.background = v.estado === "Pagado" ? "#d4edda" : "#f8d7da";

  const btn = document.createElement("button");
  btn.textContent = "Eliminar";

  btn.onclick = () => {
    viajes.splice(index, 1);
    guardar();
    mostrarHoy();
  };

  li.appendChild(btn);
  return li;
}

// 📅 MOSTRAR HOY
function mostrarHoy() {

  const hoy = obtenerFechaHoy();

  lista.innerHTML = "";

  let total = 0;
  let pendiente = 0;
  let totalViajes = 0;

  viajesMostrados = [];

  viajes.forEach((v, index) => {

    if (v.fecha === hoy) {

      viajesMostrados.push(v);
      totalViajes++;

      lista.appendChild(crearItem(v, index));

      if (v.estado === "Pagado") total += v.precio;
      else pendiente += v.precio;
    }
  });

  totalSpan.textContent = total;
  actualizarResumen(totalViajes, pendiente);

  if (totalViajes === 0) {
    lista.innerHTML = "<p>No hay viajes hoy</p>";
  }
}

// 📋 Mostrar todos
function mostrarViajes() {
  lista.innerHTML = "";

  viajesMostrados = [...viajes];

  let total = 0;
  let pendiente = 0;

  viajes.forEach((v, index) => {
    lista.appendChild(crearItem(v, index));

    if (v.estado === "Pagado") total += v.precio;
    else pendiente += v.precio;
  });

  totalSpan.textContent = total;
  actualizarResumen(viajes.length, pendiente);
}

// 🔍 Filtrar
function filtrarPorFecha() {

  const fechaSeleccionada = document.getElementById("filtroFecha").value;

  if (!fechaSeleccionada) {
    alert("Selecciona una fecha");
    return;
  }

  lista.innerHTML = "";

  let total = 0;
  let pendiente = 0;
  let totalViajes = 0;

  viajesMostrados = [];

  viajes.forEach((v, index) => {

    if (v.fecha === fechaSeleccionada) {

      viajesMostrados.push(v);
      totalViajes++;

      lista.appendChild(crearItem(v, index));

      if (v.estado === "Pagado") {
        total += v.precio;
      } else {
        pendiente += v.precio;
      }
    }
  });

  // 🔥 ACTUALIZAR TOTALES CORRECTOS
  totalSpan.textContent = total;
  actualizarResumen(totalViajes, pendiente);

  // mensaje si no hay resultados
  if (totalViajes === 0) {
    lista.innerHTML = "<p>No hay viajes en esa fecha</p>";
  }
}

// ❌ Limpiar
function limpiarFiltro() {
  document.getElementById("filtroFecha").value = "";
  mostrarHoy();
}

// 📊 Resumen
function actualizarResumen(totalViajes, pendiente) {

  let viajesTexto = document.getElementById("totalViajes");
  if (!viajesTexto) {
    viajesTexto = document.createElement("h3");
    viajesTexto.id = "totalViajes";
    totalSpan.parentElement.appendChild(viajesTexto);
  }
  viajesTexto.textContent = `🚛 Total de viajes: ${totalViajes}`;

  let deuda = document.getElementById("deuda");
  if (!deuda) {
    deuda = document.createElement("h3");
    deuda.id = "deuda";
    totalSpan.parentElement.appendChild(deuda);
  }
  deuda.textContent = `💸 Te deben: $${pendiente}`;
}
// 💾 GUARDAR HISTORIAL (SEGÚN LO QUE ESTÁS VIENDO)
function guardarHistorial() {

  if (!viajesMostrados || viajesMostrados.length === 0) {
    alert("No hay datos para guardar");
    return;
  }

  let contenido = `<h1>📋 Historial</h1><hr>`;

  let total = 0;
  let pendiente = 0;
  let totalViajes = 0;

  viajesMostrados.forEach(v => {

    totalViajes++;

    contenido += `
      <p>
        📅 ${formatearFecha(v.fecha)} |
        👤 ${v.cliente} |
        💰 $${v.precio} |
        ${v.estado}
      </p>
    `;

    if (v.estado === "Pagado") total += v.precio;
    else pendiente += v.precio;
  });

  contenido += `
    <hr>
    <h2>💰 Total: $${total}</h2>
    <h2>🚛 Total de viajes: ${totalViajes}</h2>
    <h2>💸 Te deben: $${pendiente}</h2>
  `;

  const ventana = window.open("", "", "width=800,height=600");

  ventana.document.write(`
    <html>
      <head><title>Historial</title></head>
      <body>${contenido}</body>
    </html>
  `);

  ventana.document.close();

  setTimeout(() => {
    ventana.print();
  }, 500);
}