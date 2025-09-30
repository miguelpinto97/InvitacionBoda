// Leer ID de la URL
const params = new URLSearchParams(window.location.search);
const Id = params.get("Id"); // ejemplo: ?Id=abc123

var dataInvitado;

async function cargarInvitado() {
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

        if (res.ok) {
            dataInvitado = data;
            txtInvitado.textContent = data.Nombre;
            txtCantidad.textContent = `Invitación para (${data.Cantidad})`;

            // ✅ Vehículo es a nivel de invitado general
            chkVehiculo.checked = data.Vehiculo === true;

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
                cboIntegrantes.innerHTML = '';
                data.Detalle.forEach(d => {
                    const opt = document.createElement("option");
                    opt.value = d.Integrante;
                    opt.textContent = d.Integrante;
                    cboIntegrantes.appendChild(opt);
                });

                // ✅ Evento onchange para llenar checks
                cboIntegrantes.onchange = () => {
                    if (cboIntegrantes.value === "100") {
                        // "Todos": desmarcar individuales
                        chkCivil.checked = false;
                        chkSellamiento.checked = false;
                        chkRecepcion.checked = false;
                        return;
                    }

                    // Buscar integrante seleccionado
                    const integrante = data.Detalle.find(d => d.Integrante === cboIntegrantes.value);
                    if (integrante) {
                        chkCivil.checked = integrante.Civil === true;
                        chkSellamiento.checked = integrante.Sellamiento === true;
                        chkRecepcion.checked = integrante.Recepcion === true;
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


cargarInvitado();



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

    // payload base
    const payload = {
        Id: Id,
        Civil: civil,
        Sellamiento: sellamiento,
        Recepcion: recepcion,
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
        } else {
            alert("❌ Error: " + out.error);
        }
    } catch (err) {
        showErrorToast("Error guardando asistencia", err);
    }
});
