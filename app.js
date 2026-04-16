// 📅 FUNCIÓN FECHA LOCAL SEGURA
function obtenerFechaHoy() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
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

  return `${parseInt(partes[2], 10)} ${meses[parseInt(partes[1], 10) - 1]} ${partes[0]}`;
}

// 🔠 Poner mayúscula en cada palabra
function capitalizarTexto(texto) {
  return texto
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(p => p !== "")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

// 📄 Mes en texto
function obtenerNombreMes(numeroMes) {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return meses[parseInt(numeroMes, 10) - 1];
}

// 📦 Datos
let viajes = JSON.parse(localStorage.getItem("viajes")) || [];
let viajesMostrados = [];
let modoVista = "hoy"; // hoy | fecha | mes | todo

const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");
const inputFecha = document.getElementById("fecha");
const filtroFecha = document.getElementById("filtroFecha");
const filtroMes = document.getElementById("filtroMes");

// ✅ Nuevos elementos visuales para cambio
const inputPrecio = document.getElementById("precio");
const inputPagaCon = document.getElementById("pagaCon");
const cambioVisual = document.getElementById("cambioVisual");

// 📅 Fecha automática
if (inputFecha) {
  inputFecha.value = obtenerFechaHoy();
}

// 💵 Calcular cambio solo visual
function actualizarCambioVisual() {
  const precio = parseFloat(inputPrecio.value);
  const pagaCon = parseFloat(inputPagaCon.value);

  if (isNaN(precio) || isNaN(pagaCon)) {
    cambioVisual.textContent = "💵 Cambio: $0.00";
    return;
  }

  const diferencia = pagaCon - precio;

  if (diferencia >= 0) {
    cambioVisual.textContent = `💵 Cambio: $${diferencia.toFixed(2)}`;
  } else {
    cambioVisual.textContent = `💸 Faltan: $${Math.abs(diferencia).toFixed(2)}`;
  }
}

// 🔄 Resetear visual del cambio
function resetearCambioVisual() {
  if (inputPagaCon) inputPagaCon.value = "";
  if (cambioVisual) cambioVisual.textContent = "💵 Cambio: $0.00";
}

// Eventos para cálculo visual
if (inputPrecio) {
  inputPrecio.addEventListener("input", actualizarCambioVisual);
}

if (inputPagaCon) {
  inputPagaCon.addEventListener("input", actualizarCambioVisual);
}

// 📄 Nombre para historial según vista
function obtenerNombreHistorial() {
  if (modoVista === "todo") {
    return "Historial_Completo";
  }

  if (modoVista === "fecha" && filtroFecha.value) {
    const [year, month, day] = filtroFecha.value.split("-");
    return `${parseInt(day, 10)}_${obtenerNombreMes(month)}_${year}`;
  }

  if (modoVista === "mes" && filtroMes.value) {
    const [year, month] = filtroMes.value.split("-");
    return `${obtenerNombreMes(month)}_${year}`;
  }

  return "Historial_Hoy";
}

// 🧾 Título según vista
function obtenerTituloHistorial() {
  if (modoVista === "todo") {
    return "📋 Historial Completo";
  }

  if (modoVista === "fecha" && filtroFecha.value) {
    return `📋 Historial - ${formatearFecha(filtroFecha.value)}`;
  }

  if (modoVista === "mes" && filtroMes.value) {
    const [year, month] = filtroMes.value.split("-");
    return `📋 Historial - ${obtenerNombreMes(month)} ${year}`;
  }

  return `📋 Historial - ${formatearFecha(obtenerFechaHoy())}`;
}

// 💾 Guardar en localStorage
function guardar() {
  localStorage.setItem("viajes", JSON.stringify(viajes));
}

// 📋 Crear item del historial
function crearItem(v) {
  const li = document.createElement("li");

  li.innerHTML = `
    📅 ${formatearFecha(v.fecha)} <br>
    👤 ${v.cliente} - 💰 $${Number(v.precio).toFixed(2)}
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

    if (modoVista === "fecha" && filtroFecha.value) {
      filtrarPorFecha();
    } else if (modoVista === "mes" && filtroMes.value) {
      filtrarPorMes();
    } else if (modoVista === "todo") {
      mostrarViajes();
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
  deuda.textContent = `💸 Te deben: $${pendiente.toFixed(2)}`;
}

// 📝 Guardar viaje
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const cliente = capitalizarTexto(document.getElementById("cliente").value);
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

  if (!fecha) {
    alert("Seleccione una fecha");
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

  // Después de guardar, vuelve a la vista de hoy
  formulario.reset();
  inputFecha.value = obtenerFechaHoy();
  resetearCambioVisual();
  mostrarHoy();
});

// 📅 Mostrar solo hoy
function mostrarHoy() {
  modoVista = "hoy";
  lista.innerHTML = "";

  const hoy = obtenerFechaHoy();
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
        total += Number(v.precio);
      } else {
        pendiente += Number(v.precio);
      }
    }
  });

  totalSpan.textContent = total.toFixed(2);
  actualizarResumen(totalViajes, pendiente);

  if (totalViajes === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay viajes hoy</div>';
  }
}

// 📋 Mostrar todos
function mostrarViajes() {
  modoVista = "todo";
  filtroFecha.value = "";
  filtroMes.value = "";
  lista.innerHTML = "";

  viajesMostrados = [...viajes];

  let total = 0;
  let pendiente = 0;

  viajes.forEach((v) => {
    lista.appendChild(crearItem(v));

    if (v.estado === "Pagado") {
      total += Number(v.precio);
    } else {
      pendiente += Number(v.precio);
    }
  });

  totalSpan.textContent = total.toFixed(2);
  actualizarResumen(viajes.length, pendiente);

  if (viajes.length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay viajes guardados</div>';
  }
}

// 🔍 Filtrar por fecha
function filtrarPorFecha() {
  const fechaSeleccionada = filtroFecha.value;

  if (!fechaSeleccionada) {
    alert("Selecciona una fecha");
    return;
  }

  modoVista = "fecha";
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
        total += Number(v.precio);
      } else {
        pendiente += Number(v.precio);
      }
    }
  });

  totalSpan.textContent = total.toFixed(2);
  actualizarResumen(totalViajes, pendiente);

  if (totalViajes === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay viajes en esa fecha</div>';
  }
}

// 📅 Filtrar por mes
function filtrarPorMes() {
  const mesSeleccionado = filtroMes.value;

  if (!mesSeleccionado) {
    alert("Selecciona un mes");
    return;
  }

  modoVista = "mes";
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
        total += Number(v.precio);
      } else {
        pendiente += Number(v.precio);
      }
    }
  });

  totalSpan.textContent = total.toFixed(2);
  actualizarResumen(totalViajes, pendiente);

  if (totalViajes === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay viajes en ese mes</div>';
  }
}

// 🔍 Filtro inteligente
function filtrar() {
  const fecha = filtroFecha.value;
  const mes = filtroMes.value;

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
  filtroFecha.value = "";
  filtroMes.value = "";
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

// 💾 Guardar historial
function guardarHistorial() {
  if (!viajesMostrados || viajesMostrados.length === 0) {
    alert("No hay datos para guardar");
    return;
  }

  let total = 0;
  let pendiente = 0;
  let totalViajes = 0;

  const tituloHistorial = obtenerTituloHistorial();
  const nombreHistorial = obtenerNombreHistorial();

  let contenido = `
    <div class="hoja">
      <h1>${tituloHistorial}</h1>
      <hr>
  `;

  viajesMostrados.forEach(v => {
    totalViajes++;
    const precio = Number(v.precio);

    contenido += `
      <p>
        📅 ${formatearFecha(v.fecha)} |
        👤 ${v.cliente} |
        💰 $${precio.toFixed(2)} |
        ${v.estado}
      </p>
    `;

    if (v.estado === "Pagado") {
      total += precio;
    } else {
      pendiente += precio;
    }
  });

  contenido += `
      <hr>
      <h2>💰 Total: $${total.toFixed(2)}</h2>
      <h2>🚚 Total de viajes: ${totalViajes}</h2>
      <h2>💸 Te deben: $${pendiente.toFixed(2)}</h2>
    </div>
  `;

  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert("El navegador bloqueó la ventana emergente.");
    return;
  }

  ventana.document.write(`
    <html>
      <head>
        <title>${nombreHistorial}</title>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 40px 0;
            background: #dcdcdc;
            font-family: "Times New Roman", serif;
          }

          .hoja {
            width: 80%;
            max-width: 900px;
            min-height: 1000px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.25);
            box-sizing: border-box;
          }

          h1 {
            font-size: 28px;
            margin: 0 0 20px 0;
            font-weight: bold;
          }

          h2 {
            font-size: 22px;
            margin: 18px 0;
            font-weight: bold;
          }

          p {
            font-size: 18px;
            margin: 12px 0;
            line-height: 1.6;
          }

          hr {
            border: none;
            border-top: 1px solid #999;
            margin: 18px 0;
          }

          @media print {
            body {
              background: white;
              padding: 0;
            }

            .hoja {
              width: 100%;
              max-width: 100%;
              min-height: auto;
              box-shadow: none;
              margin: 0;
              padding: 30px;
            }
          }
        </style>
      </head>
      <body>
        ${contenido}
        <script>
          document.title = "${nombreHistorial}";
        <\/script>
      </body>
    </html>
  `);

  ventana.document.close();

  setTimeout(() => {
    ventana.focus();
    ventana.print();
  }, 500);
}

// 🚀 INICIO
mostrarHoy();
resetearCambioVisual();