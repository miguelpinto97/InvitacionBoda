// netlify/functions/invitado.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC6Di7CyehlsNI08PGpBHU75VJhVMWxEJs",
    authDomain: "invitadosboda-e1314.firebaseapp.com",
    projectId: "invitadosboda-e1314",
    storageBucket: "invitadosboda-e1314.firebasestorage.app",
    messagingSenderId: "159250168397",
    appId: "1:159250168397:web:aa693cd4472ba0bf2f3a04",
    measurementId: "G-6Y772NVW4S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handler(event) {
    try {
        // 🔹 GET -> traer datos
        if (event.httpMethod === "GET") {
            const { Id } = event.queryStringParameters;

            if (!Id) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Falta parámetro 'Id'" })
                };
            }

            const docRef = doc(db, "Invitados", Id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        Nombre: data.Nombre,
                        Cantidad: data.Cantidad,
                        Vehiculo: data.Vehiculo || false,
                        Detalle: data.Detalle || [],
                        MostrarSellamiento: data.MostrarSellamiento || false,
                    })
                };
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Invitado no encontrado" })
                };
            }
        }

        // 🔹 POST -> guardar asistencia
        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body || "{}");
            const { Id, Integrante, Civil, Sellamiento, Recepcion, Vehiculo, Todos, BusGrupal } = body;

            if (!Id) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Falta parámetro 'Id'" })
                };
            }

            const docRef = doc(db, "Invitados", Id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Invitado no encontrado" })
                };
            }

            const data = docSnap.data();
            let detalle = data.Detalle || [];

            // 🔹 Actualización nivel Detalle
            if (Todos) {
                detalle = detalle.map(item => ({
                    ...item,
                    Civil: Civil ?? item.Civil,
                    Sellamiento: Sellamiento ?? item.Sellamiento,
                    Recepcion: Recepcion ?? item.Recepcion,
                    BusGrupal: BusGrupal ?? item.BusGrupal
                }));
            } else if (Integrante) {
                detalle = detalle.map(item =>
                    item.Integrante === Integrante
                        ? {
                            ...item,
                            Civil: Civil ?? item.Civil,
                            Sellamiento: Sellamiento ?? item.Sellamiento,
                            Recepcion: Recepcion ?? item.Recepcion,
                            BusGrupal: BusGrupal ?? item.BusGrupal
                        }
                        : item
                );
            }

            // 🔹 Actualización nivel Invitado general
            const updatePayload = {
                Detalle: detalle,
                Vehiculo: (Vehiculo !== undefined && Vehiculo !== null)
                    ? Vehiculo
                    : (data.Vehiculo || false)
            };


            await updateDoc(docRef, updatePayload);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Asistencia guardada correctamente" })
            };
        }

        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método no permitido" })
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
}
