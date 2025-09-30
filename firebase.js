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

      if (res.ok) {
        txtInvitado.textContent = data.Nombre;
        txtCantidad.textContent = `Invitación para (${data.Cantidad})`;
      } else {
        txtInvitado.textContent = "- No encontrado -";
      }
    } catch (err) {
      console.error("Error cargando invitado", err);
    }
  }

  cargarInvitado();