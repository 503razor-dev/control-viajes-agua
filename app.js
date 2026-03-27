// 📅 FUNCIÓN FECHA LOCAL SEGURA
function obtenerFechaHoy() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 📅 Formatear fecha bonita
function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const partes = fecha.split("-");
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return `${parseInt(partes[2])} ${meses[parseInt(partes[1]) - 1]} ${partes[0]}`;
}

// 🔠 Primera letra mayúscula en cada palabra
function capitalizarTexto(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .filter(p => p.trim() !== "")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

// 📦 Datos
let viajes = JSON.parse(localStorage.getItem("viajes")) || [];
let viajesMostrados = [];

const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");
const inputFecha = document.getElementById("fecha");
const filtroFecha = document.getElementById("filtroFecha");
const filtroMes = document.getElementById("filtroMes");

// 📅 Fecha automática
if (inputFecha) {
  inputFecha.value = obtenerFechaHoy();
}

// 🚀 INICIO
mostrarHoy();

// 📝 Guardar viaje
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = capitalizarTexto(document.getElementById("cliente").value.trim());
  const precio = parseFloat(document.getElementById("precio").value);
  const estado = document.getElementById("estado").value;
  const fecha = document.getElementById("fecha").value;

  if (!cliente) {
    alert("Ingrese un cliente");
    return;
  }

  if (isNaN(precio)) {
    alert("Precio inválido");
    return;
  }

  const viaje = {
    id: Date.now(),
    cliente,
    precio,
    estado,
    fecha
  };

  viajes.push(viaje);
  guardar();
  mostrarHoy();

  formulario.reset();
  inputFecha.value = obtenerFechaHoy();
});

// 💾 Guardar en localStorage
function guardar() {
  localStorage.setItem("viajes", JSON.stringify(viajes));
}

// 📋 Crear item del historial
function crearItem(v) {
  const li = document.createElement("li");

  li.innerHTML = `
    📅 ${formatearFecha(v.fecha)} <br>
    👤 ${v.cliente} - 💰 $${v.precio}
    <strong>(${v.estado})</strong>
  `;

  li.style.background = v.estado === "Pagado" ? "#d4edda" : "#f8d7da";

  const btn = document.createElement("button");
  btn.textContent = "Eliminar";
  btn.className = "btn-eliminar";

  btn.onclick = () => {
    const confirmar = confirm(`¿Eliminar el viaje de ${v.cliente}?`);
    if (!confirmar) return;

    viajes = viajes.filter(viaje => viaje.id !== v.id);
    guardar();

    if (filtroFecha && filtroFecha.value) {
      filtrarPorFecha();
    } else if (filtroMes && filtroMes.value) {
      filtrarPorMes();
    } else {
      mostrarHoy();
    }
  };

  li.appendChild(document.createElement("br"));
  li.appendChild(btn);

  return li;
}

// 📊 Actualizar resumen
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

// 📅 Mostrar solo hoy
function mostrarHoy() {
  const hoy = obtenerFechaHoy();

  lista.innerHTML = "";

  let total = 0;
  let pendiente = 0;
  let totalViajes = 0;

  viajesMostrados = [];

  viajes.forEach((v) => {
    if (v.fecha === hoy) {
      viajesMostrados.push(v);
      totalViajes++;

      lista.appendChild(crearItem(v));

      if (v.estado === "Pagado") {
        total += v.precio;
      } else {
        pendiente += v.precio;
      }
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

  viajes.forEach((v) => {
    lista.appendChild(crearItem(v));

    if (v.estado === "Pagado") {
      total += v.precio;
    } else {
      pendiente += v.precio;
    }
  });

  totalSpan.textContent = total;
  actualizarResumen(viajes.length, pendiente);

  if (viajes.length === 0) {
    lista.innerHTML = "<p>No hay viajes guardados</p>";
  }
}

// 🔍 Filtrar por fecha
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

  viajes.forEach((v) => {
    if (v.fecha === fechaSeleccionada) {
      viajesMostrados.push(v);
      totalViajes++;

      lista.appendChild(crearItem(v));

      if (v.estado === "Pagado") {
        total += v.precio;
      } else {
        pendiente += v.precio;
      }
    }
  });

  totalSpan.textContent = total;
  actualizarResumen(totalViajes, pendiente);

  if (totalViajes === 0) {
    lista.innerHTML = "<p>No hay viajes en esa fecha</p>";
  }
}

// 📅 Filtrar por mes
function filtrarPorMes() {
  const mesSeleccionado = document.getElementById("filtroMes").value;

  if (!mesSeleccionado) {
    alert("Selecciona un mes");
    return;
  }

  lista.innerHTML = "";

  let total = 0;
  let pendiente = 0;
  let totalViajes = 0;

  viajesMostrados = [];

  viajes.forEach((v) => {
    if (v.fecha && v.fecha.startsWith(mesSeleccionado)) {
      viajesMostrados.push(v);
      totalViajes++;

      lista.appendChild(crearItem(v));

      if (v.estado === "Pagado") {
        total += v.precio;
      } else {
        pendiente += v.precio;
      }
    }
  });

  totalSpan.textContent = total;
  actualizarResumen(totalViajes, pendiente);

  if (totalViajes === 0) {
    lista.innerHTML = "<p>No hay viajes en ese mes</p>";
  }
}

// 🔍 Filtro inteligente: un solo botón
function filtrar() {
  const fecha = document.getElementById("filtroFecha").value;
  const mes = document.getElementById("filtroMes").value;

  if (fecha) {
    filtrarPorFecha();
    return;
  }

  if (mes) {
    filtrarPorMes();
    return;
  }

  alert("Selecciona una fecha o un mes");
}

// ❌ Limpiar búsqueda
function limpiarFiltro() {
  document.getElementById("filtroFecha").value = "";
  document.getElementById("filtroMes").value = "";
  mostrarHoy();
}

// 🔄 Evitar conflicto entre filtros
if (filtroFecha) {
  filtroFecha.addEventListener("change", () => {
    if (filtroFecha.value) {
      filtroMes.value = "";
    }
  });
}

if (filtroMes) {
  filtroMes.addEventListener("change", () => {
    if (filtroMes.value) {
      filtroFecha.value = "";
    }
  });
}

// 💾 Guardar historial según lo que estás viendo
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

    if (v.estado === "Pagado") {
      total += v.precio;
    } else {
      pendiente += v.precio;
    }
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
      <head>
        <title>Historial</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1, h2 {
            margin-bottom: 10px;
          }
          p {
            margin: 8px 0;
          }
          hr {
            margin: 20px 0;
          }
        </style>
      </head>
      <body>${contenido}</body>
    </html>
  `);

  ventana.document.close();

  setTimeout(() => {
    ventana.print();
  }, 500);
}