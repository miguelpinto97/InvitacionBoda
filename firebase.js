// Leer ID de la URL
const params = new URLSearchParams(window.location.search);
const Id = params.get("Id"); // ejemplo: ?Id=abc123

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

        if (res.ok) {
            txtInvitado.textContent = data.Nombre;
            txtCantidad.textContent = `Invitación para (${data.Cantidad})`;

            if (data.Detalle && data.Detalle.length > 0) {
                // 🔹 Concatenar integrantes
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

                // 🔹 Poblar combo de integrantes
                nombres.forEach((nombre, idx) => {
                    const opt = document.createElement("option");
                    opt.value = nombre;
                    opt.textContent = nombre;
                    cboIntegrantes.appendChild(opt);
                });
            } else {
                txtDetalle.textContent = "";
                cboIntegrantes.innerHTML = "<option>(sin integrantes)</option>";
            }
        } else {
            txtInvitado.textContent = "- No encontrado -";
        }
    } catch (err) {
        console.error("Error cargando invitado", err);
    }
}


cargarInvitado();