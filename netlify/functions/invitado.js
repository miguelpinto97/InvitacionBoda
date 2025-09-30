// netlify/functions/invitado.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
                    Cantidad: data.Cantidad
                })
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Invitado no encontrado" })
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
}
