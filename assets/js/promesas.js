// Importa funciones necesarias de Firebase Firestore para manipular documentos y colecciones.
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Importa la referencia a la base de datos desde el archivo firebase.js.
import { db } from "./firebase.js";

// Función para registrar una persona.
export const registrarPersona = async (persona) => {
    try {
        // Agrega un nuevo documento a la colección "users" en la base de datos con los datos de la persona.
        await addDoc(collection(db, "users"), persona);
    } catch (e) {
        // Maneja cualquier error que ocurra durante la adición del documento.
        console.error("Error agregando documento: ", e);
    }
};

// Función para obtener todas las personas.
export const obtenerPersonas = async () => {
    // Obtiene una referencia a la colección "users" en la base de datos.
    const personasCol = collection(db, "users");
    // Recupera todos los documentos de la colección "users".
    const personasSnapshot = await getDocs(personasCol);
    // Mapea los documentos recuperados a una lista de objetos, incluyendo el ID del documento.
    const personasList = personasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // Usa el spread operator para incluir todos los datos del documento.
    }));
    // Retorna la lista de personas.
    return personasList;
};

// Función para actualizar una persona.
export const actualizarPersona = async (id, persona) => {
    try {
        // Obtiene una referencia al documento específico en la colección "users" usando el ID.
        const personaRef = doc(db, "users", id);
        // Actualiza el documento con los nuevos datos de la persona.
        await updateDoc(personaRef, persona);
    } catch (e) {
        // Maneja cualquier error que ocurra durante la actualización del documento.
        console.error("Error actualizando documento: ", e);
    }
};

// Función para eliminar una persona.
export const eliminarPersona = async (id) => {
    try {
        // Obtiene una referencia al documento específico en la colección "users" usando el ID.
        const personaRef = doc(db, "users", id);
        // Elimina el documento de la base de datos.
        await deleteDoc(personaRef);
    } catch (e) {
        // Maneja cualquier error que ocurra durante la eliminación del documento.
        console.error("Error eliminando documento: ", e);
    }
};
