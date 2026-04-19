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

function formatearFechaParaNombre(fecha) {
  if (!fecha) return "Sin_fecha";

  const partes = fecha.split("-");
  const year = partes[0];
  const month = partes[1];
  const day = partes[2];

  return `${day}_${obtenerNombreMes(month)}_${year}`;
}

function formatearNumero(numero) {
  return String(numero).padStart(2, "0");
}

function capitalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .trim()
    .split(/\s+/)
    .filter(p => p !== "")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

function obtenerNombreMes(numeroMes) {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return meses[parseInt(numeroMes, 10) - 1];
}

let viajes = JSON.parse(localStorage.getItem("viajes")) || [];
let viajesMostrados = [];
let modoVista = "hoy";

const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
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
const inputPrecio = document.getElementById("precio");
const inputCantidadViajes = document.getElementById("cantidadViajes");
const inputGasto = document.getElementById("gasto");
const inputPagaCon = document.getElementById("pagaCon");
const inputEstado = document.getElementById("estado");
const totalVisual = document.getElementById("totalVisual");
const cambioVisual = document.getElementById("cambioVisual");

const bloqueCantidadViajes = document.getElementById("bloqueCantidadViajes");
const bloquePagaCon = document.getElementById("bloquePagaCon");
const bloqueGasto = document.getElementById("bloqueGasto");
const bloqueEstado = document.getElementById("bloqueEstado");

if (inputFecha) {
  inputFecha.value = obtenerFechaHoy();
}

function actualizarFormularioSegunTipo() {
  const tipo = tipoRegistro.value;

  if (tipo === "viaje") {
    inputCliente.placeholder = "Cliente o concepto";

    inputPrecio.style.display = "block";
    bloqueCantidadViajes.style.display = "block";
    bloquePagaCon.style.display = "block";
    bloqueEstado.style.display = "block";
    bloqueGasto.style.display = "none";

    inputPrecio.placeholder = "Precio o ingreso";
    inputGasto.value = "";
  }

 if (tipo === "soloDinero") {
  inputCliente.placeholder = "Concepto del ingreso";

  inputPrecio.style.display = "block";
  bloqueCantidadViajes.style.display = "none";
  bloquePagaCon.style.display = "none";
  bloqueEstado.style.display = "none";
  bloqueGasto.style.display = "none";

  inputPrecio.placeholder = "Monto del ingreso";

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
    bloqueCantidadViajes.style.display = "none";
    bloquePagaCon.style.display = "none";
    bloqueEstado.style.display = "none";
    bloqueGasto.style.display = "block";

    inputPrecio.value = "";
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

  if (tipo === "gasto") {
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

  if (diferencia >= 0) {
    cambioVisual.textContent = `Cambio: $${diferencia.toFixed(2)}`;
  } else {
    cambioVisual.textContent = `Faltan: $${Math.abs(diferencia).toFixed(2)}`;
  }
}

function resetearCambioVisual() {
  if (inputPagaCon) inputPagaCon.value = "";
  if (inputCantidadViajes) inputCantidadViajes.value = 1;
  if (inputPrecio) inputPrecio.value = "";
  if (inputGasto) inputGasto.value = "";
  if (totalVisual) totalVisual.textContent = "Total: $0.00";
  if (cambioVisual) cambioVisual.textContent = "Cambio: $0.00";
}

if (inputPrecio) {
  inputPrecio.addEventListener("input", actualizarCambioVisual);
}

if (inputCantidadViajes) {
  inputCantidadViajes.addEventListener("input", actualizarCambioVisual);
}

if (inputPagaCon) {
  inputPagaCon.addEventListener("input", actualizarCambioVisual);
}

if (tipoRegistro) {
  tipoRegistro.addEventListener("change", actualizarFormularioSegunTipo);
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

function obtenerNombreHistorial() {
  const tipo = tipoMejorDia ? tipoMejorDia.value : "";

  if (modoVista === "todo") {
    return "Historial_Completo";
  }

  if (modoVista === "fecha" && filtroFecha.value) {
    return formatearFechaParaNombre(filtroFecha.value);
  }

  if (modoVista === "mejorDia" && filtroFecha.value) {
    let tipoTexto = "";

    if (tipo === "dinero") {
      tipoTexto = "[Mas_Dinero]";
    } else if (tipo === "viajes") {
      tipoTexto = "[Mas_Viajes]";
    }

    return `${formatearFechaParaNombre(filtroFecha.value)}_Mejor_Dia${tipoTexto}`;
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

function obtenerTituloHistorial() {
  const tipo = tipoMejorDia ? tipoMejorDia.value : "";

  if (modoVista === "todo") {
    return "HISTORIAL COMPLETO";
  }

  if (modoVista === "fecha" && filtroFecha.value) {
    return `HISTORIAL - ${formatearFecha(filtroFecha.value)}`;
  }

  if (modoVista === "mejorDia" && filtroFecha.value) {
    let tipoTexto = "";

    if (tipo === "dinero") {
      tipoTexto = "[MAS DINERO]";
    } else if (tipo === "viajes") {
      tipoTexto = "[MAS VIAJES]";
    }

    return `HISTORIAL - ${formatearFecha(filtroFecha.value)} (MEJOR DIA) ${tipoTexto}`;
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

function guardar() {
  localStorage.setItem("viajes", JSON.stringify(viajes));
}

function actualizarResumen(totalViajes, pendiente, totalGastado, disponible) {
  document.getElementById("totalViajes").textContent = `Total de viajes: ${totalViajes}`;
  document.getElementById("totalGastado").textContent = `Total gastado: $${totalGastado.toFixed(2)}`;
  document.getElementById("disponible").textContent = `Disponible: $${disponible.toFixed(2)}`;
  document.getElementById("deuda").textContent = `Te deben: $${pendiente.toFixed(2)}`;
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
      totalGastado += Number(v.gasto || 0);

      if (v.estado === "Pagado") {
        total += Number(v.precio || 0);
      } else {
        pendiente += Number(v.precio || 0);
      }
    }
  });

  let disponible = total - totalGastado;

  if (filtroTipo && filtroTipo.value === "gasto") {
    disponible = 0;
  }

  return { total, pendiente, totalGastado, totalViajes, disponible };
}

function crearItem(v, numero) {
  const li = document.createElement("li");
  const numeroFormateado = formatearNumero(numero);

  if (v.tipo === "gasto") {
    li.innerHTML = `
      <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong> <br>
      ${v.cliente} - $${Number(v.gasto || 0).toFixed(2)} <strong>(Gasto)</strong>
    `;
    li.style.background = "#fff3cd";
  } else if (v.tipo === "soloDinero") {
    li.innerHTML = `
      <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong> <br>
      ${v.cliente} - $${Number(v.precio || 0).toFixed(2)} <strong>(Solo dinero)</strong>
    `;
    li.style.background = "#d1ecf1";
  } else {
    li.innerHTML = `
      <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong> <br>
      ${v.cliente} - $${Number(v.precio).toFixed(2)} <strong>(${v.estado})</strong>
      ${Number(v.gasto || 0) > 0 ? `<br>Gasto: $${Number(v.gasto).toFixed(2)}` : ""}
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

function crearTituloGrupo(texto) {
  const li = document.createElement("li");
  li.className = "grupo-titulo";
  li.textContent = texto;
  return li;
}

function aplicarFiltroTipo(registros) {
  const tipo = filtroTipo ? filtroTipo.value : "todo";

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

function renderListaAgrupada(registros) {
  lista.innerHTML = "";

  const registrosFiltrados = aplicarFiltroTipo(registros);

  const viajesPagados = registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pagado");
  const viajesPendientes = registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pendiente");
  const soloDinero = registrosFiltrados.filter(v => v.tipo === "soloDinero");
  const gastos = registrosFiltrados.filter(v => v.tipo === "gasto");

  let contadorPagado = 1;
  let contadorPendiente = 1;
  let contadorSoloDinero = 1;
  let contadorGasto = 1;

  if (viajesPagados.length > 0) {
    lista.appendChild(crearTituloGrupo("PAGADO"));
    viajesPagados.forEach(v => {
      lista.appendChild(crearItem(v, contadorPagado));
      contadorPagado++;
    });
  }

  if (viajesPendientes.length > 0) {
    lista.appendChild(crearTituloGrupo("PENDIENTE"));
    viajesPendientes.forEach(v => {
      lista.appendChild(crearItem(v, contadorPendiente));
      contadorPendiente++;
    });
  }

  if (soloDinero.length > 0) {
    lista.appendChild(crearTituloGrupo("SOLO DINERO"));
    soloDinero.forEach(v => {
      lista.appendChild(crearItem(v, contadorSoloDinero));
      contadorSoloDinero++;
    });
  }

  if (gastos.length > 0) {
    lista.appendChild(crearTituloGrupo("GASTO"));
    gastos.forEach(v => {
      lista.appendChild(crearItem(v, contadorGasto));
      contadorGasto++;
    });
  }

  if (registrosFiltrados.length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros</div>';
  }
}

function refrescarVistaActual() {
  if (modoVista === "mejorDia" && filtroFecha.value) {
    filtrarPorFecha();
  } else if (modoVista === "fecha" && filtroFecha.value) {
    filtrarPorFecha();
  } else if (modoVista === "mes" && filtroMes.value) {
    filtrarPorMes();
  } else if (modoVista === "rango" && filtroFechaInicio.value && filtroFechaFin.value) {
    filtrarPorRango();
  } else if (modoVista === "todo") {
    mostrarViajes();
  } else {
    mostrarHoy();
  }
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const tipo = tipoRegistro.value;
  const cliente = document.getElementById("cliente").value.trim();
  const precio = parseFloat(document.getElementById("precio").value) || 0;
  const cantidadViajes = parseInt(document.getElementById("cantidadViajes").value, 10) || 1;
  const gasto = parseFloat(document.getElementById("gasto").value) || 0;
  const estado = document.getElementById("estado").value;
  const fecha = document.getElementById("fecha").value;

  if (!cliente) {
    alert("Ingrese un cliente o concepto");
    return;
  }

  if (!fecha) {
    alert("Seleccione una fecha");
    return;
  }

  if (tipo === "gasto") {
    if (gasto <= 0) {
      alert("Debes ingresar un gasto válido");
      return;
    }

    const registroGasto = {
      id: Date.now(),
      tipo: "gasto",
      cliente: capitalizarTexto(cliente),
      precio: 0,
      gasto,
      estado: "Pagado",
      fecha
    };

    viajes.push(registroGasto);
    guardar();

    formulario.reset();
    tipoRegistro.value = "viaje";
    inputFecha.value = obtenerFechaHoy();
    inputCantidadViajes.value = 1;
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
    inputCantidadViajes.value = 1;
    resetearCambioVisual();
    actualizarFormularioSegunTipo();
    mostrarHoy();
    return;
  }

if (precio >= 0) {
    if (cantidadViajes < 1) {
      alert("La cantidad de viajes debe ser mínimo 1");
      return;
    }

    for (let i = 0; i < cantidadViajes; i++) {
      viajes.push({
        id: Date.now() + i + Math.floor(Math.random() * 1000),
        tipo: "viaje",
        cliente: capitalizarTexto(cliente),
        precio,
        gasto: 0,
        estado,
        fecha
      });
    }

    guardar();

    formulario.reset();
    tipoRegistro.value = "viaje";
    inputFecha.value = obtenerFechaHoy();
    inputCantidadViajes.value = 1;
    resetearCambioVisual();
    actualizarFormularioSegunTipo();
    mostrarHoy();
    return;
  }

  alert("Debes ingresar un precio para viaje o solo dinero, o un gasto para guardar gasto");
});

function buscarMejorDia() {
  if (!viajes || viajes.length === 0) {
    alert("No hay registros guardados");
    return;
  }

  const tipo = tipoMejorDia ? tipoMejorDia.value : "";

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
      if (actual.dinero > mejor.dinero) {
        mejorFecha = fecha;
      } else if (actual.dinero === mejor.dinero && fecha > mejorFecha) {
        mejorFecha = fecha;
      }
    } else {
      if (actual.viajes > mejor.viajes) {
        mejorFecha = fecha;
      } else if (actual.viajes === mejor.viajes && fecha > mejorFecha) {
        mejorFecha = fecha;
      }
    }
  });

  filtroFecha.value = mejorFecha;
  modoVista = "mejorDia";
  filtrarPorFecha();
}

function mostrarHoy() {
  modoVista = "hoy";
  const hoy = obtenerFechaHoy();
  viajesMostrados = viajes.filter(v => v.fecha === hoy);

  renderListaAgrupada(viajesMostrados);

  const resumen = calcularResumen(aplicarFiltroTipo(viajesMostrados));
  totalSpan.textContent = resumen.total.toFixed(2);
  actualizarResumen(resumen.totalViajes, resumen.pendiente, resumen.totalGastado, resumen.disponible);

  if (aplicarFiltroTipo(viajesMostrados).length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros hoy</div>';
  }
}

function mostrarViajes() {
  modoVista = "todo";
  viajesMostrados = [...viajes];

  renderListaAgrupada(viajesMostrados);

  const resumen = calcularResumen(aplicarFiltroTipo(viajesMostrados));
  totalSpan.textContent = resumen.total.toFixed(2);
  actualizarResumen(resumen.totalViajes, resumen.pendiente, resumen.totalGastado, resumen.disponible);

  if (aplicarFiltroTipo(viajesMostrados).length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros guardados</div>';
  }
}

function filtrarPorFecha() {
  const fechaSeleccionada = filtroFecha.value;

  if (!fechaSeleccionada) {
    alert("Selecciona una fecha");
    return;
  }

  if (modoVista !== "mejorDia") {
    modoVista = "fecha";
  }

  viajesMostrados = viajes.filter(v => v.fecha === fechaSeleccionada);
  renderListaAgrupada(viajesMostrados);

  const resumen = calcularResumen(aplicarFiltroTipo(viajesMostrados));
  totalSpan.textContent = resumen.total.toFixed(2);
  actualizarResumen(resumen.totalViajes, resumen.pendiente, resumen.totalGastado, resumen.disponible);

  if (aplicarFiltroTipo(viajesMostrados).length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros en esa fecha</div>';
  }
}

function filtrarPorMes() {
  const mesSeleccionado = filtroMes.value;

  if (!mesSeleccionado) {
    alert("Selecciona un mes");
    return;
  }

  modoVista = "mes";
  viajesMostrados = viajes.filter(v => v.fecha && v.fecha.startsWith(mesSeleccionado));
  renderListaAgrupada(viajesMostrados);

  const resumen = calcularResumen(aplicarFiltroTipo(viajesMostrados));
  totalSpan.textContent = resumen.total.toFixed(2);
  actualizarResumen(resumen.totalViajes, resumen.pendiente, resumen.totalGastado, resumen.disponible);

  if (aplicarFiltroTipo(viajesMostrados).length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros en ese mes</div>';
  }
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
  viajesMostrados = viajes.filter(v => v.fecha >= fechaInicio && v.fecha <= fechaFin);
  renderListaAgrupada(viajesMostrados);

  const resumen = calcularResumen(aplicarFiltroTipo(viajesMostrados));
  totalSpan.textContent = resumen.total.toFixed(2);
  actualizarResumen(resumen.totalViajes, resumen.pendiente, resumen.totalGastado, resumen.disponible);

  if (aplicarFiltroTipo(viajesMostrados).length === 0) {
    lista.innerHTML = '<div class="mensaje-vacio">No hay registros en ese rango de fechas</div>';
  }
}

function filtrar() {
  const tipoBusqueda = buscarPor.value;

  if (tipoBusqueda === "fecha") {
    filtrarPorFecha();
    return;
  }

  if (tipoBusqueda === "mes") {
    filtrarPorMes();
    return;
  }

  if (tipoBusqueda === "rango") {
    filtrarPorRango();
    return;
  }

  if (tipoBusqueda === "mejorDia") {
    buscarMejorDia();
    return;
  }

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

if (filtroTipo) {
  filtroTipo.addEventListener("change", () => {
    refrescarVistaActual();
  });
}

if (buscarPor) {
  buscarPor.addEventListener("change", actualizarVisibilidadBusqueda);
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

  const viajesPagados = registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pagado");
  const viajesPendientes = registrosFiltrados.filter(v => v.tipo === "viaje" && v.estado === "Pendiente");
  const soloDinero = registrosFiltrados.filter(v => v.tipo === "soloDinero");
  const gastos = registrosFiltrados.filter(v => v.tipo === "gasto");

  let contenido = `
    <div class="hoja">
      <h1>${tituloHistorial}</h1>
      <hr>
  `;

  let contadorPagado = 1;
  let contadorPendiente = 1;
  let contadorSoloDinero = 1;
  let contadorGasto = 1;

  if (viajesPagados.length > 0) {
    contenido += `<h2>PAGADO</h2>`;
    viajesPagados.forEach((v) => {
      const numeroFormateado = formatearNumero(contadorPagado);
      contenido += `
        <p>
          <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
          ${v.cliente} - $${Number(v.precio).toFixed(2)} <strong>(${v.estado})</strong>
        </p>
      `;
      contadorPagado++;
    });
  }

  if (viajesPendientes.length > 0) {
    contenido += `<h2>PENDIENTE</h2>`;
    viajesPendientes.forEach((v) => {
      const numeroFormateado = formatearNumero(contadorPendiente);
      contenido += `
        <p>
          <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
          ${v.cliente} - $${Number(v.precio).toFixed(2)} <strong>(${v.estado})</strong>
        </p>
      `;
      contadorPendiente++;
    });
  }

  if (soloDinero.length > 0) {
    contenido += `<h2>SOLO DINERO</h2>`;
    soloDinero.forEach((v) => {
      const numeroFormateado = formatearNumero(contadorSoloDinero);
      contenido += `
        <p>
          <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
          ${v.cliente} - $${Number(v.precio || 0).toFixed(2)} <strong>(Solo dinero)</strong>
        </p>
      `;
      contadorSoloDinero++;
    });
  }

  if (gastos.length > 0) {
    contenido += `<h2>GASTO</h2>`;
    gastos.forEach((v) => {
      const numeroFormateado = formatearNumero(contadorGasto);
      contenido += `
        <p>
          <strong>${numeroFormateado}- ${formatearFecha(v.fecha)}</strong><br>
          ${v.cliente} - $${Number(v.gasto || 0).toFixed(2)} <strong>(Gasto)</strong>
        </p>
      `;
      contadorGasto++;
    });
  }

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

actualizarVisibilidadBusqueda();
actualizarFormularioSegunTipo();
mostrarHoy();
resetearCambioVisual();