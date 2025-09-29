      // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
        import { getFirestore, collection, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyC6Di7CyehlsNI08PGpBHU75VJhVMWxEJs",
            authDomain: "invitadosboda-e1314.firebaseapp.com",
            projectId: "invitadosboda-e1314",
            storageBucket: "invitadosboda-e1314.firebasestorage.app",
            messagingSenderId: "159250168397",
            appId: "1:159250168397:web:aa693cd4472ba0bf2f3a04",
            measurementId: "G-6Y772NVW4S"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Leer ID de la URL
        const params = new URLSearchParams(window.location.search);
        const Id = params.get("Id"); // ejemplo: ?Id=abc123

        async function cargarInvitado() {
            if (!Id) {
                console.log("⚠️ No se encontró 'Id' en la URL");
                return;
            }

            // Buscar documento con ese Id
            const docRef = doc(db, "Invitados", Id);
            const docSnap = await getDoc(docRef);
            var txtInvitado = document.getElementById("txtInvitado");
            var txtCantidad = document.getElementById("txtCantidad");

            if (docSnap.exists()) {

                txtInvitado.textContent = docSnap.data().Nombre;
                txtCantidad.textContent = "Invitación para (" + docSnap.data().Cantidad + ")";


            } else {
                txtInvitado.textContent = "- No encontrado -";
            }
        }

        cargarInvitado();