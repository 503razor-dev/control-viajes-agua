const MAX_SELLOS = 9;
const URL_APP_PUBLICADA = "https://503razor-dev.github.io/control-viajes-agua/";

let viajes = JSON.parse(localStorage.getItem("viajes")) || [];
let tarjetas = JSON.parse(localStorage.getItem("tarjetasFidelidad")) || [];
let viajesMostrados = [];
let modoVista = "hoy";

const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const listaTarjetas = document.getElementById("listaTarjetas");
const contenedorTarjetas = document.getElementById("contenedorTarjetas");
const flechaTarjetas = document.getElementById("flechaTarjetas");
const totalSpan = document.getElementById("total");
const inputFecha = document.getElementById("fecha");

const filtroFecha = document.getElementById("filtroFecha");
const filtroMes = document.getElementById("filtroMes");
const filtroFechaInicio = document.getElementById("filtroFechaInicio");
const filtroFechaFin = document.getElementById("filtroFechaFin");
const tipoMejorDia = document.getElementById("tipoMejorDia");
const filtroTipo = document.getElementById("filtroTipo");
const buscarPor = document.getElementById("buscarPor");

const bloqueFecha = document.getElementById("bloqueFecha");
const bloqueMes = document.getElementById("bloqueMes");
const bloqueRango = document.getElementById("bloqueRango");
const bloqueMejorDia = document.getElementById("bloqueMejorDia");

const tipoRegistro = document.getElementById("tipoRegistro");
const inputCliente = document.getElementById("cliente");
const inputLugar = document.getElementById("lugar");
const inputCodigo = document.getElementById("codigo");
const inputPrecio = document.getElementById("precio");
const inputCantidadViajes = document.getElementById("cantidadViajes");
const inputGasto = document.getElementById("gasto");
const inputPagaCon = document.getElementById("pagaCon");
const inputEstado = document.getElementById("estado");
const totalVisual = document.getElementById("totalVisual");
const cambioVisual = document.getElementById("cambioVisual");

const bloqueLugarCodigo = document.getElementById("bloqueLugarCodigo");
const bloqueFidelidadNuevo = document.getElementById("bloqueFidelidadNuevo");
const vistaClienteNuevo = document.getElementById("vistaClienteNuevo");
const vistaLugarNuevo = document.getElementById("vistaLugarNuevo");
const vistaCodigoNuevo = document.getElementById("vistaCodigoNuevo");
const vistaSellosNuevo = document.getElementById("vistaSellosNuevo");

const bloqueCantidadViajes = document.getElementById("bloqueCantidadViajes");
const bloquePagaCon = document.getElementById("bloquePagaCon");
const bloqueGasto = document.getElementById("bloqueGasto");
const bloqueEstado = document.getElementById("bloqueEstado");

function obtenerFechaHoy() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const partes = fecha.split("-");
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return `${parseInt(partes[2], 10)} ${meses[parseInt(partes[1], 10) - 1]} ${partes[0]}`;
}

function obtenerNombreMes(numeroMes) {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return meses[parseInt(numeroMes, 10) - 1];
}

function formatearFechaParaNombre(fecha) {
  if (!fecha) return "Sin_fecha";

  const partes = fecha.split("-");
  return `${partes[2]}_${obtenerNombreMes(partes[1])}_${partes[0]}`;
}

function formatearNumero(numero) {
  return String(numero).padStart(2, "0");
}

function capitalizarTexto(texto) {
  if (!texto) return "";

  return texto
    .trim()
    .split(/\s+/)
    .filter(palabra => palabra !== "")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

function escaparHtml(texto) {
  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function guardar() {
  localStorage.setItem("viajes", JSON.stringify(viajes));
  localStorage.setItem("tarjetasFidelidad", JSON.stringify(tarjetas));
}

function generarCodigoTarjeta() {
  const mayorCodigo = tarjetas.reduce((mayor, tarjeta) => {
    const numero = parseInt(tarjeta.codigo, 10);
    return Number.isNaN(numero) ? mayor : Math.max(mayor, numero);
  }, 0);

  return String(mayorCodigo + 1).padStart(3, "0");
}

function dibujarSellos(cantidad) {
  const sellosMarcados = Math.min(Number(cantidad || 0), MAX_SELLOS);
  const sellos = [];

  for (let i = 1; i <= MAX_SELLOS; i++) {
    sellos.push(i <= sellosMarcados ? "☑️" : "☐");
  }

  sellos.push("🎁");
  return sellos.join("");
}

function buscarTarjetaPorCodigo(codigo) {
  return tarjetas.find(tarjeta => tarjeta.codigo === codigo);
}

function obtenerUrlTarjeta(tarjeta) {
  const url = new URL(URL_APP_PUBLICADA);
  url.searchParams.set("tipo", "viaje");
  url.searchParams.set("cliente", tarjeta.cliente);
  url.searchParams.set("lugar", tarjeta.lugar);
  url.searchParams.set("codigo", tarjeta.codigo);
  return url.toString();
}

function obtenerUrlQr(tarjeta) {
  const data = encodeURIComponent(obtenerUrlTarjeta(tarjeta));
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${data}`;
}

function alternarTarjetas() {
  const estaAbierto = contenedorTarjetas.classList.toggle("abierto");
  flechaTarjetas.textContent = estaAbierto ? "▲" : "▼";
}

function actualizarVistaTarjetaNueva() {
  if (tipoRegistro.value === "nuevoUsuario" && !inputCodigo.value) {
    inputCodigo.value = generarCodigoTarjeta();
  }

  vistaClienteNuevo.textContent = inputCliente.value.trim() || "Nuevo cliente";
  vistaLugarNuevo.textContent = inputLugar.value.trim() || "Sin lugar";
  vistaCodigoNuevo.textContent = inputCodigo.value || generarCodigoTarjeta();
  vistaSellosNuevo.textContent = dibujarSellos(0);
}

function usarTarjeta(codigo) {
  const tarjeta = buscarTarjetaPorCodigo(codigo);
  if (!tarjeta) return;

  tipoRegistro.value = "viaje";
  actualizarFormularioSegunTipo();

  inputCliente.value = tarjeta.cliente;
  inputLugar.value = tarjeta.lugar;
  inputCodigo.value = tarjeta.codigo;
  inputFecha.value = obtenerFechaHoy();

  actualizarCambioVisual();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarTarjeta(codigo) {
  const tarjeta = buscarTarjetaPorCodigo(codigo);
  if (!tarjeta) return;

  const confirmar = confirm(`¿Eliminar la tarjeta de ${tarjeta.cliente}?`);
  if (!confirmar) return;

  tarjetas = tarjetas.filter(tarjetaActual => tarjetaActual.codigo !== codigo);
  guardar();
  renderTarjetas();
}

function renderTarjetas() {
  listaTarjetas.innerHTML = "";

  if (tarjetas.length === 0) {
    listaTarjetas.innerHTML = '<div class="mensaje-vacio">No hay tarjetas de fidelidad</div>';
    return;
  }

  tarjetas.forEach((tarjeta) => {
    const li = document.createElement("li");
    li.className = "tarjeta-fidelidad";

    const urlTarjeta = obtenerUrlTarjeta(tarjeta);

    li.innerHTML = `
      <h4>Tarjeta de Fidelidad</h4>
      <div>Cliente: <strong>${escaparHtml(tarjeta.cliente)}</strong></div>
      <div>Lugar: <strong>${escaparHtml(tarjeta.lugar)}</strong></div>
      <div>Código: <strong>${escaparHtml(tarjeta.codigo)}</strong></div>
      <div>Número de viajes:</div>
      <div class="sellos">${dibujarSellos(tarjeta.sellos)}</div>
      <img class="qr" src="${obtenerUrlQr(tarjeta)}" alt="QR de ${escaparHtml(tarjeta.cliente)}">
      <a class="enlace-qr" href="${urlTarjeta}">${urlTarjeta}</a>
    `;

    const btnUsar = document.createElement("button");
    btnUsar.type = "button";
    btnUsar.className = "btn-secundario";
    btnUsar.textContent = "Usar en viaje";
    btnUsar.onclick = () => usarTarjeta(tarjeta.codigo);

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-eliminar";
    btnEliminar.textContent = "Eliminar tarjeta";
    btnEliminar.onclick = () => eliminarTarjeta(tarjeta.codigo);

    li.appendChild(btnUsar);
    li.appendChild(btnEliminar);
    listaTarjetas.appendChild(li);
  });
}

function marcarViajesEnTarjeta(codigo, cantidad) {
  if (!codigo) return;

  const tarjeta = buscarTarjetaPorCodigo(codigo);
  if (!tarjeta) return;

  tarjeta.sellos = Math.min(MAX_SELLOS, Number(tarjeta.sellos || 0) + Number(cantidad || 1));

  if (tarjeta.sellos >= MAX_SELLOS) {
    alert(`La tarjeta de ${tarjeta.cliente} ya completó ${MAX_SELLOS} viajes. Tiene regalo 🎁`);
  }
}

function aplicarDatosDesdeQr() {
  const params = new URLSearchParams(window.location.search);
  const cliente = params.get("cliente");
  const lugar = params.get("lugar");
  const codigo = params.get("codigo");

  if (!cliente && !lugar && !codigo) return;

  tipoRegistro.value = "viaje";
  actualizarFormularioSegunTipo();

  inputCliente.value = cliente || "";
  inputLugar.value = lugar || "";
  inputCodigo.value = codigo || "";
  inputFecha.value = obtenerFechaHoy();
}

function actualizarFormularioSegunTipo() {
  const tipo = tipoRegistro.value;

  if (tipo === "viaje") {
    inputCliente.placeholder = "Cliente";
    inputPrecio.style.display = "block";
    bloqueLugarCodigo.style.display = "block";
    bloqueCantidadViajes.style.display = "block";
    bloquePagaCon.style.display = "block";
    bloqueEstado.style.display = "block";
    bloqueGasto.style.display = "none";
    bloqueFidelidadNuevo.style.display = "none";
    inputPrecio.placeholder = "Precio o ingreso";
    inputGasto.value = "";
  }

  if (tipo === "nuevoUsuario") {
    inputCliente.placeholder = "Cliente";
    inputPrecio.style.display = "none";
    bloqueLugarCodigo.style.display = "block";
    bloqueCantidadViajes.style.display = "none";
    bloquePagaCon.style.display = "none";
    bloqueEstado.style.display = "none";
    bloqueGasto.style.display = "none";
    bloqueFidelidadNuevo.style.display = "block";

    inputPrecio.value = "";
    inputCantidadViajes.value = 1;
    inputPagaCon.value = "";
    inputEstado.value = "Pagado";
    inputGasto.value = "";
    inputCodigo.value = generarCodigoTarjeta();

    totalVisual.textContent = "Total: $0.00";
    cambioVisual.textContent = "Cambio: $0.00";

    actualizarVistaTarjetaNueva();
  }

  if (tipo === "soloDinero") {
    inputCliente.placeholder = "Concepto del ingreso";
    inputPrecio.style.display = "block";
    bloqueLugarCodigo.style.display = "none";
    bloqueCantidadViajes.style.display = "none";
    bloquePagaCon.style.display = "none";
    bloqueEstado.style.display = "none";
    bloqueGasto.style.display = "none";
    bloqueFidelidadNuevo.style.display = "none";

    inputPrecio.placeholder = "Monto del ingreso";
    inputLugar.value = "";
    inputCodigo.value = "";
    inputCantidadViajes.value = 1;
    inputPagaCon.value = "";
    inputEstado.value = "Pagado";
    inputGasto.value = "";

    totalVisual.textContent = "Total: $0.00";
    cambioVisual.textContent = "Cambio: $0.00";
  }

  if (tipo === "gasto") {
    inputCliente.placeholder = "Concepto del gasto";
    inputPrecio.style.display = "none";
    bloqueLugarCodigo.style.display = "none";
    bloqueCantidadViajes.style.display = "none";
    bloquePagaCon.style.display = "none";
    bloqueEstado.style.display = "none";
    bloqueGasto.style.display = "block";
    bloqueFidelidadNuevo.style.display = "none";

    inputPrecio.value = "";
    inputLugar.value = "";
    inputCodigo.value = "";
    inputCantidadViajes.value = 1;
    inputPagaCon.value = "";
    inputEstado.value = "Pagado";

    totalVisual.textContent = "Total: $0.00";
    cambioVisual.textContent = "Cambio: $0.00";
  }

  actualizarCambioVisual();
}

function actualizarCambioVisual() {
  const tipo = tipoRegistro.value;
  const precio = parseFloat(inputPrecio.value) || 0;
  const cantidad = tipo === "viaje" ? (parseInt(inputCantidadViajes.value, 10) || 1) : 1;
  const pagaCon = parseFloat(inputPagaCon.value);

  if (tipo === "gasto" || tipo === "nuevoUsuario") {
    totalVisual.textContent = "Total: $0.00";
    cambioVisual.textContent = "Cambio: $0.00";
    return;
  }

  const total = precio * cantidad;
  totalVisual.textContent = `Total: $${total.toFixed(2)}`;

  if (total <= 0 || isNaN(pagaCon)) {
    cambioVisual.textContent = "Cambio: $0.00";
    return;
  }

  const diferencia = pagaCon - total;
  cambioVisual.textContent = diferencia >= 0
    ? `Cambio: $${diferencia.toFixed(2)}`
    : `Faltan: $${Math.abs(diferencia).toFixed(2)}`;
}

function resetearCambioVisual() {
  inputPagaCon.value = "";
  inputCantidadViajes.value = 1;
  inputPrecio.value = "";
  inputGasto.value = "";
  inputLugar.value = "";
  inputCodigo.value = "";
  totalVisual.textContent = "Total: $0.00";
  cambioVisual.textContent = "Cambio: $0.00";
}

function actualizarVisibilidadBusqueda() {
  bloqueFecha.style.display = "none";
  bloqueMes.style.display = "none";
  bloqueRango.style.display = "none";
  bloqueMejorDia.style.display = "none";

  const tipo = buscarPor.value;

  if (tipo === "fecha") bloqueFecha.style.display = "block";
  if (tipo === "mes") bloqueMes.style.display = "block";
  if (tipo === "rango") bloqueRango.style.display = "block";
  if (tipo === "mejorDia") bloqueMejorDia.style.display = "block";
}

function aplicarFiltroTipo(registros) {
  const tipo = filtroTipo.value;

  if (tipo === "ingreso") {
    return registros.filter(v => (v.tipo === "viaje" && v.estado === "Pagado") || v.tipo === "soloDinero");
  }

  if (tipo === "pendiente") {
    return registros.filter(v => v.tipo === "viaje" && v.estado === "Pendiente");
  }

  if (tipo === "soloDinero") {
    return registros.filter(v => v.tipo === "soloDinero");
  }

  if (tipo === "gasto") {
    return registros.filter(v => v.tipo === "gasto");
  }

  return registros;
}

function calcularResumen(registros) {
  let total = 0;
  let pendiente = 0;
  let totalGastado = 0;
  let totalViajes = 0;

  registros.forEach((v) => {
    if (v.tipo === "gasto") {
      totalGastado += Number(v.gasto || 0);
      return;
    }

    if (v.tipo === "soloDinero") {
      total += Number(v.precio || 0);
      return;
    }

    if (v.tipo === "viaje") {
      totalViajes++;

      if (v.estado === "Pagado") {
        total += Number(v.precio || 0);
      } else {
        pendiente += Number(v.precio || 0);
      }
    }
  });

  let disponible = total - totalGastado;

  if (filtroTipo.value === "gasto") {
    disponible = 0;
  }

  return { total, pendiente, totalGastado, totalViajes, disponible };
}

function actualizarResumen(totalViajes, pendiente, totalGastado, disponible) {
  document.getElementById("totalViajes").textContent = `Total de viajes: ${totalViajes}`;
  document.getElementById("totalGastado").textContent = `Total gastado: $${totalGastado.toFixed(2)}`;
  document.getElementById("disponible").textContent = `Disponible: $${disponible.toFixed(2)}`;
  document.getElementById("deuda").textContent = `Te deben: $${pendiente.toFixed(2)}`;
}

function crearTituloGrupo(texto, cantidad, grupoId) {
  const li = document.createElement("li");
  li.className = "grupo-titulo";
  li.dataset.abierto = "false";

  li.innerHTML = `
    <span>${texto} (${cantidad})</span>
    <span class="flecha-grupo">▼</span>
  `;

  li.onclick = () => alternarGrupoHistorial(grupoId, li);
  return li;
}

function alternarGrupoHistorial(grupoId, tituloGrupo) {
  const items = document.querySelectorAll(`[data-grupo-historial="${grupoId}"]`);
  const flecha = tituloGrupo.querySelector(".flecha-grupo");
  const estaAbierto = tituloGrupo.dataset.abierto === "true";

  items.forEach(item => {
    item.classList.toggle("item-historial-oculto", estaAbierto);
  });

  tituloGrupo.dataset.abierto = estaAbierto ? "false" : "true";
  flecha.textContent = estaAbierto ? "▼" : "▲";
}

function crearItem(v, numero) {
  const li = document.createElement("li");
  const numeroFormateado = formatearNumero(numero);
  const lugarTexto = v.lugar ? `<br>Lugar: ${escaparHtml(v.lugar)}` : "";
  const codigoTexto = v.codigo ? `<br>Código: ${escaparHtml(v.codigo)}` : "";

  if (v.tipo === "gasto") {
    li.innerHTML = `
      <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
      ${escaparHtml(v.cliente)} - $${Number(v.gasto || 0).toFixed(2)} <strong>(Gasto)</strong>
    `;
    li.style.background = "#fff3cd";
  } else if (v.tipo === "soloDinero") {
    li.innerHTML = `
      <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
      ${escaparHtml(v.cliente)} - $${Number(v.precio || 0).toFixed(2)} <strong>(Solo dinero)</strong>
    `;
    li.style.background = "#d1ecf1";
  } else {
    li.innerHTML = `
      <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
      ${escaparHtml(v.cliente)} - $${Number(v.precio || 0).toFixed(2)} <strong>(${v.estado})</strong>
      ${lugarTexto}
      ${codigoTexto}
    `;
    li.style.background = v.estado === "Pagado" ? "#d4edda" : "#f8d7da";
  }

  const btn = document.createElement("button");
  btn.textContent = "Eliminar";
  btn.className = "btn-eliminar";

  btn.onclick = () => {
    const confirmar = confirm(`¿Eliminar el registro de ${v.cliente}?`);
    if (!confirmar) return;

    viajes = viajes.filter(viaje => viaje.id !== v.id);
    guardar();
    refrescarVistaActual();
  };

  li.appendChild(document.createElement("br"));
  li.appendChild(btn);

  return li;
}

function agregarGrupoHistorial(titulo, registros, grupoId) {
  if (registros.length === 0) return;

  lista.appendChild(crearTituloGrupo(titulo, registros.length, grupoId));

  registros.forEach((registro, index) => {
    const item = crearItem(registro, index + 1);
    item.dataset.grupoHistorial = grupoId;
    item.classList.add("item-historial-oculto");
    lista.appendChild(item);
  });
}

function renderListaAgrupada(registros) {
  lista.innerHTML = "";

  const registrosFiltrados = aplicarFiltroTipo(registros);

  const viajesPagados = registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pagado");
  const viajesPendientes = registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pendiente");
  const soloDinero = registrosFiltrados.filter(v => v.tipo === "soloDinero");
  const gastos = registrosFiltrados.filter(v => v.tipo === "gasto");

  agregarGrupoHistorial("PAGADO", viajesPagados, "pagado");
  agregarGrupoHistorial("PENDIENTE", viajesPendientes, "pendiente");
  agregarGrupoHistorial("SOLO DINERO", soloDinero, "solo-dinero");
  agregarGrupoHistorial("GASTO", gastos, "gasto");

  if (registrosFiltrados.length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros</div>';
  }
}

function refrescarVistaActual() {
  if (modoVista === "fecha" || modoVista === "mejorDia") {
    filtrarPorFecha();
  } else if (modoVista === "mes") {
    filtrarPorMes();
  } else if (modoVista === "rango") {
    filtrarPorRango();
  } else if (modoVista === "todo") {
    mostrarViajes();
  } else {
    mostrarHoy();
  }
}

function actualizarPantalla(registros, mensajeVacio) {
  viajesMostrados = registros;
  renderListaAgrupada(viajesMostrados);

  const resumen = calcularResumen(aplicarFiltroTipo(viajesMostrados));
  totalSpan.textContent = resumen.total.toFixed(2);
  actualizarResumen(resumen.totalViajes, resumen.pendiente, resumen.totalGastado, resumen.disponible);

  if (aplicarFiltroTipo(viajesMostrados).length === 0) {
    lista.innerHTML = `<div class="mensaje-vacio">${mensajeVacio}</div>`;
  }
}

function mostrarHoy() {
  modoVista = "hoy";
  const hoy = obtenerFechaHoy();
  actualizarPantalla(viajes.filter(v => v.fecha === hoy), "No hay registros hoy");
}

function mostrarViajes() {
  modoVista = "todo";
  actualizarPantalla([...viajes], "No hay registros guardados");
}

function filtrarPorFecha() {
  const fechaSeleccionada = filtroFecha.value;

  if (!fechaSeleccionada) {
    alert("Selecciona una fecha");
    return;
  }

  if (modoVista !== "mejorDia") modoVista = "fecha";

  actualizarPantalla(
    viajes.filter(v => v.fecha === fechaSeleccionada),
    "No hay registros en esa fecha"
  );
}

function filtrarPorMes() {
  const mesSeleccionado = filtroMes.value;

  if (!mesSeleccionado) {
    alert("Selecciona un mes");
    return;
  }

  modoVista = "mes";

  actualizarPantalla(
    viajes.filter(v => v.fecha && v.fecha.startsWith(mesSeleccionado)),
    "No hay registros en ese mes"
  );
}

function filtrarPorRango() {
  const fechaInicio = filtroFechaInicio.value;
  const fechaFin = filtroFechaFin.value;

  if (!fechaInicio || !fechaFin) {
    alert("Selecciona fecha inicio y fecha fin");
    return;
  }

  if (fechaInicio > fechaFin) {
    alert("La fecha inicio no puede ser mayor que la fecha fin");
    return;
  }

  modoVista = "rango";

  actualizarPantalla(
    viajes.filter(v => v.fecha >= fechaInicio && v.fecha <= fechaFin),
    "No hay registros en ese rango de fechas"
  );
}

function buscarMejorDia() {
  if (viajes.length === 0) {
    alert("No hay registros guardados");
    return;
  }

  const tipo = tipoMejorDia.value;

  if (!tipo) {
    alert("Selecciona 'Más viajes' o 'Más dinero'");
    return;
  }

  const base = aplicarFiltroTipo(viajes);
  const resumenPorFecha = {};

  base.forEach(v => {
    if (!v.fecha) return;

    if (!resumenPorFecha[v.fecha]) {
      resumenPorFecha[v.fecha] = { viajes: 0, dinero: 0 };
    }

    if (v.tipo === "viaje") {
      resumenPorFecha[v.fecha].viajes++;

      if (v.estado === "Pagado") {
        resumenPorFecha[v.fecha].dinero += Number(v.precio || 0);
      }
    }

    if (v.tipo === "soloDinero") {
      resumenPorFecha[v.fecha].dinero += Number(v.precio || 0);
    }
  });

  const fechas = Object.keys(resumenPorFecha);

  if (fechas.length === 0) {
    alert("No hay fechas válidas registradas");
    return;
  }

  let mejorFecha = fechas[0];

  fechas.forEach(fecha => {
    const actual = resumenPorFecha[fecha];
    const mejor = resumenPorFecha[mejorFecha];

    if (tipo === "dinero") {
      if (actual.dinero > mejor.dinero || (actual.dinero === mejor.dinero && fecha > mejorFecha)) {
        mejorFecha = fecha;
      }
    }

    if (tipo === "viajes") {
      if (actual.viajes > mejor.viajes || (actual.viajes === mejor.viajes && fecha > mejorFecha)) {
        mejorFecha = fecha;
      }
    }
  });

  filtroFecha.value = mejorFecha;
  modoVista = "mejorDia";
  filtrarPorFecha();
}

function filtrar() {
  const tipoBusqueda = buscarPor.value;

  if (tipoBusqueda === "fecha") return filtrarPorFecha();
  if (tipoBusqueda === "mes") return filtrarPorMes();
  if (tipoBusqueda === "rango") return filtrarPorRango();
  if (tipoBusqueda === "mejorDia") return buscarMejorDia();

  mostrarViajes();
}

function limpiarFiltro() {
  filtroFecha.value = "";
  filtroMes.value = "";
  filtroFechaInicio.value = "";
  filtroFechaFin.value = "";
  filtroTipo.value = "todo";
  buscarPor.value = "ninguno";
  tipoMejorDia.value = "";

  actualizarVisibilidadBusqueda();
  mostrarHoy();
}

function obtenerTituloHistorial() {
  if (modoVista === "todo") return "HISTORIAL COMPLETO";

  if ((modoVista === "fecha" || modoVista === "mejorDia") && filtroFecha.value) {
    return `HISTORIAL - ${formatearFecha(filtroFecha.value)}`;
  }

  if (modoVista === "mes" && filtroMes.value) {
    const [year, month] = filtroMes.value.split("-");
    return `HISTORIAL - ${obtenerNombreMes(month)} ${year}`;
  }

  if (modoVista === "rango" && filtroFechaInicio.value && filtroFechaFin.value) {
    return `HISTORIAL - ${formatearFecha(filtroFechaInicio.value)} al ${formatearFecha(filtroFechaFin.value)}`;
  }

  return `HISTORIAL - ${formatearFecha(obtenerFechaHoy())}`;
}

function obtenerNombreHistorial() {
  if (modoVista === "todo") return "Historial_Completo";

  if ((modoVista === "fecha" || modoVista === "mejorDia") && filtroFecha.value) {
    return formatearFechaParaNombre(filtroFecha.value);
  }

  if (modoVista === "mes" && filtroMes.value) {
    const [year, month] = filtroMes.value.split("-");
    return `${obtenerNombreMes(month)}_${year}`;
  }

  if (modoVista === "rango" && filtroFechaInicio.value && filtroFechaFin.value) {
    return `${formatearFechaParaNombre(filtroFechaInicio.value)}_al_${formatearFechaParaNombre(filtroFechaFin.value)}`;
  }

  return `Historial_Hoy_${formatearFechaParaNombre(obtenerFechaHoy())}`;
}

function guardarHistorial() {
  if (!viajesMostrados || viajesMostrados.length === 0) {
    alert("No hay datos para guardar");
    return;
  }

  const registrosFiltrados = aplicarFiltroTipo(viajesMostrados);

  if (registrosFiltrados.length === 0) {
    alert("No hay datos para guardar");
    return;
  }

  const resumen = calcularResumen(registrosFiltrados);
  const tituloHistorial = obtenerTituloHistorial();
  const nombreHistorial = obtenerNombreHistorial();

  const grupos = [
    ["PAGADO", registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pagado")],
    ["PENDIENTE", registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pendiente")],
    ["SOLO DINERO", registrosFiltrados.filter(v => v.tipo === "soloDinero")],
    ["GASTO", registrosFiltrados.filter(v => v.tipo === "gasto")]
  ];

  let contenido = `
    <div class="hoja">
      <h1>${tituloHistorial}</h1>
      <hr>
  `;

  grupos.forEach(([titulo, registros]) => {
    if (registros.length === 0) return;

    contenido += `<h2>${titulo}</h2>`;

    registros.forEach((v, index) => {
      const numeroFormateado = formatearNumero(index + 1);
      const monto = v.tipo === "gasto" ? Number(v.gasto || 0) : Number(v.precio || 0);
      const etiqueta = v.tipo === "gasto" ? "Gasto" : (v.tipo === "soloDinero" ? "Solo dinero" : v.estado);
      const lugarTexto = v.lugar ? `<br>Lugar: ${escaparHtml(v.lugar)}` : "";
      const codigoTexto = v.codigo ? `<br>Código: ${escaparHtml(v.codigo)}` : "";

      contenido += `
        <p>
          <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
          ${escaparHtml(v.cliente)} - $${monto.toFixed(2)} <strong>(${etiqueta})</strong>
          ${lugarTexto}
          ${codigoTexto}
        </p>
      `;
    });
  });

  contenido += `
      <hr>
      <h2>Total: $${resumen.total.toFixed(2)}</h2>
      <h2>Total de viajes: ${resumen.totalViajes}</h2>
      <h2>Total gastado: $${resumen.totalGastado.toFixed(2)}</h2>
      <h2>Disponible: $${resumen.disponible.toFixed(2)}</h2>
      <h2>Te deben: $${resumen.pendiente.toFixed(2)}</h2>
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

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const tipo = tipoRegistro.value;
  const cliente = inputCliente.value.trim();
  const lugar = inputLugar.value.trim();
  const codigo = inputCodigo.value.trim();
  const precio = parseFloat(inputPrecio.value) || 0;
  const cantidadViajes = parseInt(inputCantidadViajes.value, 10) || 1;
  const gasto = parseFloat(inputGasto.value) || 0;
  const estado = inputEstado.value;
  const fecha = inputFecha.value;

  if (!cliente) {
    alert("Ingrese un cliente o concepto");
    return;
  }

  if (!fecha) {
    alert("Seleccione una fecha");
    return;
  }

  if (tipo === "nuevoUsuario") {
    if (!lugar) {
      alert("Ingrese el lugar del cliente");
      return;
    }

    if (buscarTarjetaPorCodigo(codigo)) {
      alert("Ese código ya existe. Se generará uno nuevo.");
      inputCodigo.value = generarCodigoTarjeta();
      actualizarVistaTarjetaNueva();
      return;
    }

    tarjetas.push({
      id: Date.now(),
      cliente: capitalizarTexto(cliente),
      lugar: capitalizarTexto(lugar),
      codigo,
      sellos: 0,
      fechaCreacion: fecha
    });

    guardar();

    formulario.reset();
    tipoRegistro.value = "viaje";
    inputFecha.value = obtenerFechaHoy();
    resetearCambioVisual();
    actualizarFormularioSegunTipo();
    renderTarjetas();
    mostrarHoy();

    alert("Tarjeta de fidelidad creada correctamente");
    return;
  }

  if (tipo === "gasto") {
    if (gasto <= 0) {
      alert("Debes ingresar un gasto válido");
      return;
    }

    viajes.push({
      id: Date.now(),
      tipo: "gasto",
      cliente: capitalizarTexto(cliente),
      precio: 0,
      gasto,
      estado: "Pagado",
      fecha
    });

    guardar();

    formulario.reset();
    tipoRegistro.value = "viaje";
    inputFecha.value = obtenerFechaHoy();
    resetearCambioVisual();
    actualizarFormularioSegunTipo();
    mostrarHoy();
    return;
  }

  if (tipo === "soloDinero") {
    if (precio <= 0) {
      alert("Debes ingresar un monto válido");
      return;
    }

    viajes.push({
      id: Date.now(),
      tipo: "soloDinero",
      cliente: capitalizarTexto(cliente),
      precio,
      gasto: 0,
      estado: "Pagado",
      fecha
    });

    guardar();

    formulario.reset();
    tipoRegistro.value = "viaje";
    inputFecha.value = obtenerFechaHoy();
    resetearCambioVisual();
    actualizarFormularioSegunTipo();
    mostrarHoy();
    return;
  }

  if (cantidadViajes < 1) {
    alert("La cantidad de viajes debe ser mínimo 1");
    return;
  }

  for (let i = 0; i < cantidadViajes; i++) {
    viajes.push({
      id: Date.now() + i + Math.floor(Math.random() * 1000),
      tipo: "viaje",
      cliente: capitalizarTexto(cliente),
      lugar: capitalizarTexto(lugar),
      codigo,
      precio,
      gasto: 0,
      estado,
      fecha
    });
  }

  marcarViajesEnTarjeta(codigo, cantidadViajes);
  guardar();
  renderTarjetas();

  formulario.reset();
  tipoRegistro.value = "viaje";
  inputFecha.value = obtenerFechaHoy();
  resetearCambioVisual();
  actualizarFormularioSegunTipo();
  mostrarHoy();
});

inputPrecio.addEventListener("input", actualizarCambioVisual);
inputCantidadViajes.addEventListener("input", actualizarCambioVisual);
inputPagaCon.addEventListener("input", actualizarCambioVisual);
tipoRegistro.addEventListener("change", actualizarFormularioSegunTipo);
inputCliente.addEventListener("input", actualizarVistaTarjetaNueva);
inputLugar.addEventListener("input", actualizarVistaTarjetaNueva);
filtroTipo.addEventListener("change", refrescarVistaActual);
buscarPor.addEventListener("change", actualizarVisibilidadBusqueda);

inputFecha.value = obtenerFechaHoy();

resetearCambioVisual();
actualizarVisibilidadBusqueda();
actualizarFormularioSegunTipo();
aplicarDatosDesdeQr();
mostrarHoy();
renderTarjetas();
