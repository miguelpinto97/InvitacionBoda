// Leer ID de la URL
const params = new URLSearchParams(window.location.search);
const Id = params.get("Id"); // ejemplo: ?Id=abc123

var dataInvitado;

async function cargarInvitado(reconstruirCombo) {
    if (!Id) {
        console.log("⚠️ No se encontró 'Id' en la URL");
        return;
    }

    try {
        const res = await fetch(`/api/invitado?Id=${Id}`);
        const data = await res.json();

        const txtInvitado = document.getElementById("txtInvitado");
        const txtCantidad = document.getElementById("txtCantidad");
        const txtDetalle = document.getElementById("txtDetalle");
        const cboIntegrantes = document.getElementById("cboIntegrantes");

        // Checkboxes
        const chkCivil = document.getElementById("chkCivil");
        const chkSellamiento = document.getElementById("chkSellamiento");
        const chkRecepcion = document.getElementById("chkRecepcion");
        const chkVehiculo = document.getElementById("chkVehiculo");
        const chkBusGrupal = document.getElementById("chkBusGrupal");


        const divSellamiento = document.getElementById("divSellamiento");
        const divFotosTemplo = document.getElementById("divFotosTemplo");
        const divCheckSellamiento = document.getElementById("divCheckSellamiento");
        const divRecepcion = document.getElementById("divRecepcion");


        const divTransporte = document.getElementById("divTransporte");
        const divCheckTransporte = document.getElementById("divCheckTransporte");
        const divCheckRecepcion = document.getElementById("divCheckRecepcion");

        if (res.ok) {
            dataInvitado = data;
            txtInvitado.textContent = data.Nombre;
            txtCantidad.textContent = `Invitación para (${data.Detalle.length})`;

            // ✅ Vehículo es a nivel de invitado general
            chkVehiculo.checked = data.Vehiculo === true;

            const lblFechaLimite = document.getElementById("lblFechaLimite");

            if (dataInvitado.FechaLimite) {
                lblFechaLimite.textContent = `Antes del ${data.FechaLimite}`;
            } else {
                lblFechaLimite.textContent = "Antes del 11 de Octubre";
            }
            console.log(dataInvitado);

            console.log(data.MostrarSellamiento);

            if (data.MostrarSellamiento === true || data.MostrarSellamiento === "true" || data.MostrarSellamiento === 1) {
                divSellamiento.style.display = 'block';
                divCheckSellamiento.style.display = 'block';
                divFotosTemplo.style.display = 'none';
                divFotosTemplo.classList.remove("aparicion-progresiva");
            } else {
                divSellamiento.style.display = 'none';
                divCheckSellamiento.style.display = 'none';
                divFotosTemplo.style.display = 'block';
                divSellamiento.classList.remove("aparicion-progresiva");
            }

            console.log(data.OcultarTransporte)
            if (data.OcultarTransporte === true || data.OcultarTransporte === "true" || data.OcultarTransporte === 1) {
                divTransporte.style.display = 'none';
                divCheckTransporte.style.display = 'none';
                divTransporte.classList.remove("aparicion-progresiva");

            } else {

                divTransporte.style.display = 'block';
                divCheckTransporte.style.display = 'block';
            }

            console.log(data.OcultarRecepcion)
            if (data.OcultarRecepcion === true || data.OcultarRecepcion === "true" || data.OcultarRecepcion === 1) {
                divRecepcion.style.display = 'none';
                divCheckRecepcion.style.display = 'none';
                divCheckRecepcion2.style.display = 'none';
                divRecepcion.classList.remove("aparicion-progresiva");
                divRecepcion.classList.remove("d-flex");

            } else {

                divRecepcion.style.display = 'flex';
                divCheckRecepcion.style.display = 'block';
                divCheckRecepcion2.style.display = 'block';
         }

            if (data.Detalle && data.Detalle.length > 0) {

                if (data.Detalle.length == 1 && data.Detalle[0].Integrante == "UNICO") {
                    document.getElementById("dIntegrantes").style.display = "none";
                    document.getElementById("dAplicarTodos").style.display = "none";

                    // Guardamos flag en memoria para usar después
                    dataInvitado.EsUnico = true;
                    const integrante = data.Detalle[0];
                    if (integrante) {
                        chkCivil.checked = integrante.Civil === true;
                        chkSellamiento.checked = integrante.Sellamiento === true;
                        chkRecepcion.checked = integrante.Recepcion === true;
                        chkBusGrupal.checked = integrante.BusGrupal === true;
                    }
                    console.log("UNICO");
                    return;
                }

                // Concatenar nombres
                const nombres = data.Detalle.map(d => d.Integrante);
                let texto = "";
                if (nombres.length === 1) {
                    texto = nombres[0];
                } else if (nombres.length === 2) {
                    texto = nombres.join(" y ");
                } else {
                    texto = nombres.slice(0, -1).join(", ") + " y " + nombres[nombres.length - 1];
                }
                txtDetalle.textContent = texto;

                // Poblar combo
                if (reconstruirCombo) {
                    cboIntegrantes.innerHTML = '';
                    data.Detalle.forEach(d => {
                        const opt = document.createElement("option");
                        opt.value = d.Integrante;
                        opt.textContent = d.Integrante;
                        cboIntegrantes.appendChild(opt);
                    });
                }


                // ✅ Evento onchange para llenar checks
                cboIntegrantes.onchange = () => {
                    if (cboIntegrantes.value === "100") {
                        // "Todos": desmarcar individuales
                        chkCivil.checked = false;
                        chkSellamiento.checked = false;
                        chkRecepcion.checked = false;
                        chkBusGrupal.checked = false;
                        return;
                    }

                    // Buscar integrante seleccionado
                    const integrante = data.Detalle.find(d => d.Integrante === cboIntegrantes.value);
                    if (integrante) {
                        chkCivil.checked = integrante.Civil === true;
                        chkSellamiento.checked = integrante.Sellamiento === true;
                        chkRecepcion.checked = integrante.Recepcion === true;
                        chkBusGrupal.checked = integrante.BusGrupal === true;
                    }
                };

                // Cargar el primero por defecto
                cboIntegrantes.dispatchEvent(new Event("change"));
            } else {
                txtDetalle.textContent = "";
            }
        } else {
            txtInvitado.textContent = "- No encontrado -";
        }
    } catch (err) {
        console.error("Error cargando invitado", err);
    }
}


cargarInvitado(true);



// Referencias
const cboIntegrantes = document.getElementById("cboIntegrantes");
const chkTodos = document.getElementById("chkTodos");

// Evento para ocultar/mostrar select
chkTodos.onchange = () => {
    if (chkTodos.checked) {
        // Ocultar select y seleccionar "Todos"
        cboIntegrantes.style.display = "none";
        cboIntegrantes.value = "100";
        cboIntegrantes.dispatchEvent(new Event("change"));
    } else {
        // Mostrar select
        cboIntegrantes.style.display = "block";

        // Seleccionar primer integrante real (índice 1)
        if (cboIntegrantes.options.length > 0) {
            cboIntegrantes.selectedIndex = 0;
            cboIntegrantes.dispatchEvent(new Event("change"));
        }
    }
};

document.getElementById("btnGuardarAsistencia").addEventListener("click", async () => {
    if (!dataInvitado) return;

    const chkVehiculo = document.getElementById("chkVehiculo").checked;

    // valores seleccionados
    const civil = document.getElementById("chkCivil").checked;
    const sellamiento = document.getElementById("chkSellamiento").checked;
    const recepcion = document.getElementById("chkRecepcion").checked;
    const busGrupal = document.getElementById("chkBusGrupal").checked;

    // payload base
    const payload = {
        Id: Id,
        Civil: civil,
        Sellamiento: sellamiento,
        Recepcion: recepcion,
        BusGrupal: busGrupal,
        Vehiculo: chkVehiculo
    };

    if (dataInvitado.EsUnico) {
        // Caso especial "UNICO" -> siempre Todos
        console.log("Guardar UNICO");
        payload.Todos = true;
        payload.Integrante = null;
    } else {
        // Normal
        const chkTodos = document.getElementById("chkTodos").checked;
        payload.Todos = chkTodos;

        if (!chkTodos) {
            const cbo = document.getElementById("cboIntegrantes");
            payload.Integrante = cbo.value;
        }
    }

    try {
        const res = await fetch(`/.netlify/functions/invitado`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        const out = await res.json();

        if (res.ok) {
            showSuccessToast("Asistencia guardada");
            // actualizar cache local
            dataInvitado.Vehiculo = chkVehiculo;
            cargarInvitado(false);
        } else {
            alert("❌ Error: " + out.error);
        }
    } catch (err) {
        showErrorToast("Error guardando asistencia", err);
    }
});
