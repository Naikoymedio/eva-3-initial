// Importación de las funciones CRUD desde el archivo promesas.js
import { actualizarPersona, eliminarPersona, obtenerPersonas, registrarPersona } from "./promesas.js";

// Función para cambiar entre modo claro y oscuro
const toggleModoOscuro = () => {
    document.body.classList.toggle("modo-oscuro"); // Alterna la clase "modo-oscuro" en el cuerpo del documento
};

// Función para aumentar el tamaño de la fuente
const aumentarFuente = () => {
    const estilosBody = window.getComputedStyle(document.body); // Obtiene los estilos actuales del cuerpo
    const tamañoActual = parseFloat(estilosBody.fontSize); // Convierte el tamaño de la fuente a un número de punto flotante
    const nuevoTamaño = tamañoActual + 2; // Incrementa el tamaño de la fuente en 2px
    document.body.style.fontSize = nuevoTamaño + "px"; // Aplica el nuevo tamaño de la fuente al cuerpo del documento
};

// Función para disminuir el tamaño de la fuente
const disminuirFuente = () => {
    const estilosBody = window.getComputedStyle(document.body); // Obtiene los estilos actuales del cuerpo
    const tamañoActual = parseFloat(estilosBody.fontSize); // Convierte el tamaño de la fuente a un número de punto flotante
    const nuevoTamaño = tamañoActual - 2; // Disminuye el tamaño de la fuente en 2px
    document.body.style.fontSize = nuevoTamaño + "px"; // Aplica el nuevo tamaño de la fuente al cuerpo del documento
};

// Evento que se ejecuta cuando la ventana se carga
window.addEventListener("load", () => {
    document.getElementById("btnRegistrar").addEventListener("click", registrar); // Añadir listener al botón "Registrar"
    document.getElementById("btnCancelar").addEventListener("click", cancelarActualizacion); // Añadir listener al botón "Cancelar"
    document.getElementById('btnActualizar').addEventListener('click', actualizar); // Añadir listener al botón "Actualizar"
    document.getElementById('modoOscuroBtn').addEventListener('click', toggleModoOscuro); // Añadir listener al botón "Modo Oscuro"
    document.getElementById('aumentarFuenteBtn').addEventListener('click', aumentarFuente); // Añadir listener al botón "Aumentar Fuente"
    document.getElementById('disminuirFuenteBtn').addEventListener('click', disminuirFuente); // Añadir listener al botón "Disminuir Fuente"
    traerDatos(); // Cargar y mostrar los datos existentes
});

// Evento que se ejecuta cuando el contenido del DOM se carga
document.addEventListener("DOMContentLoaded", () => {
    const edadSelect = document.getElementById("edad"); // Selecciona el elemento de selección de edad
    const UPDedadSelect = document.getElementById("UPDedad"); // Selecciona el elemento de selección de edad para actualización

    // Rellenar las opciones de edad
    for (let i = 1; i <= 99; i++) {
        const option = document.createElement("option"); // Crear una opción para el selector
        option.value = i; // Establecer el valor de la opción
        option.text = i; // Establecer el texto de la opción
        edadSelect.appendChild(option); // Añadir la opción al selector de edad

        const updOption = document.createElement("option"); // Crear una opción para el selector de actualización
        updOption.value = i; // Establecer el valor de la opción
        updOption.text = i; // Establecer el texto de la opción
        UPDedadSelect.appendChild(updOption); // Añadir la opción al selector de edad para actualización*/
    }
});

// Función para establecer opciones seleccionadas por defecto
const establecerSeleccionPorDefecto = () => {
    // Para el radio button de género
    document.getElementById("Masculino").checked = true; // Marcar 'Masculino' por defecto

    // Para el checkbox de preferencia
    document.getElementById("hombres").checked = true; // Marcar 'Hombres' por defecto
};

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    establecerSeleccionPorDefecto();
});

// Función para validar los datos del formulario
const validarDatos = (persona) => {
    // Validación de cada campo del formulario
    if (!persona.nombre) {
        alert("El nombre es obligatorio");
        return false;
    }
    if (!persona.apellido) {
        alert("El apellido es obligatorio");
        return false;
    }
    if (!persona.telefono || !/^\+569\d{8}$/.test(persona.telefono)) {
        alert("El teléfono es obligatorio y debe tener el formato de celular chileno (+56912345678)");
        return false;
    }
    if (!persona.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(persona.email)) {
        alert("El email es obligatorio y debe tener un formato válido");
        return false;
    }
    if (!persona.rut || !validarRUT(persona.rut)) {
        alert("El RUT es obligatorio y debe tener un formato válido");
        return false;
    }
    if (!persona.edad || isNaN(persona.edad) || persona.edad <= 0) {
        alert("La edad es obligatoria y debe ser un número positivo");
        return false;
    }
    if (!persona.genero) {
        alert("El género es obligatorio");
        return false;
    }

    // Validar género
    if (persona.genero !== "Masculino" && persona.genero !== "Femenino") {
        alert("Selecciona un género válido");
        return false;
    }

    // Validar preferencias
    if (persona.preferencias.length === 0) {
        alert("Selecciona al menos una preferencia");
        return false;
    }

    return true; // Si todos los campos son válidos
}

// Función para validar el RUT chileno
const validarRUT = (rut) => {
    if (!/^\d{7,8}-[kK\d]$/.test(rut)) {
        return false;
    }

    const [numero, digitoVerificador] = rut.split("-"); // Separar el número del dígito verificador
    let suma = 0; // Inicializar la suma en 0
    let multiplicador = 2; // Inicializar el multiplicador en 2

    // Cálculo del dígito verificador
    for (let i = numero.length - 1; i >= 0; i--) {
        suma += multiplicador * parseInt(numero.charAt(i), 10); // Multiplicar cada dígito por el multiplicador y añadir a la suma
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2; // Incrementar el multiplicador o reiniciarlo si es mayor que 7
    }

    const dvCalculado = 11 - (suma % 11); // Calcular el dígito verificador
    const dv = dvCalculado === 11 ? "0" : dvCalculado === 10 ? "k" : dvCalculado.toString(); // Convertir el dígito verificador a un string

    return dv === digitoVerificador.toLowerCase(); // Comparar el dígito calculado con el dígito verificador
}

// Función para registrar una persona
const registrar = async () => {
    const persona = {
        nombre: document.getElementById("nombre").value, // Obtener el valor del nombre
        apellido: document.getElementById("apellido").value, // Obtener el valor del apellido
        telefono: document.getElementById("telefono").value, // Obtener el valor del teléfono
        email: document.getElementById("email").value, // Obtener el valor del email
        rut: document.getElementById("rut").value, // Obtener el valor del RUT
        edad: parseInt(document.getElementById("edad").value), // Obtener el valor de la edad y convertirlo a entero
        genero: document.querySelector('input[name="genero"]:checked').value, // Obtener el valor del género seleccionado
        preferencias: Array.from(document.querySelectorAll('input[name="preferencia"]:checked')).map(el => el.value), // Obtener las preferencias seleccionadas
        describete: document.getElementById("describete").value // Obtener el valor del campo "describete"
    };

    // Validar datos antes de registrar
    if (!validarDatos(persona)) return;

    try {
        await registrarPersona(persona); // Llamar a la función para registrar la persona
        alert("Persona registrada con éxito"); // Mostrar mensaje de éxito
        limpiarFormulario(); // Limpiar el formulario después de registrar
        traerDatos(); // Actualizar la lista de personas
    } catch (error) {
        console.error("Error al registrar persona: ", error); // Mostrar error en la consola
        alert("Error al registrar persona"); // Mostrar mensaje de error
    }
};

// Función para mostrar el formulario de actualización con los datos existentes
const mostrarFormularioActualizar = (id, persona) => {
    document.getElementById("registroFormContainer").style.display = "none"; // Ocultar el formulario de registro
    document.getElementById("actualizarFormContainer").style.display = "block"; // Mostrar el formulario de actualización

    // Rellenar el formulario de actualización con los datos de la persona
    document.getElementById("UPDnombre").value = persona.nombre;
    document.getElementById("UPDapellido").value = persona.apellido;
    document.getElementById("UPDtelefono").value = persona.telefono;
    document.getElementById("UPDemail").value = persona.email;
    document.getElementById("UPDrut").value = persona.rut;
    document.getElementById("UPDedad").value = persona.edad;
    document.getElementById("UPDdescribete").value = persona.describete;

    // Seleccionar género
    if (persona.genero === "Masculino") {
        document.getElementById("UPDmasculino").checked = true;
    } else if (persona.genero === "Femenino") {
        document.getElementById("UPDfemenino").checked = true;
    }

    // Seleccionar preferencias
    document.querySelectorAll('input[name="UPDpreferencia"]').forEach(input => {
        input.checked = persona.preferencias.includes(input.value); // Marcar las preferencias seleccionadas
    });

    document.getElementById("btnActualizar").dataset.id = id; // Guardar el ID de la persona en el botón de actualizar
};

// Función para actualizar una persona
const actualizar = async () => {
    const id = document.getElementById("btnActualizar").dataset.id; // Obtener el ID de la persona a actualizar

    const persona = {
        nombre: document.getElementById("UPDnombre").value,
        apellido: document.getElementById("UPDapellido").value,
        telefono: document.getElementById("UPDtelefono").value,
        email: document.getElementById("UPDemail").value,
        rut: document.getElementById("UPDrut").value,
        edad: parseInt(document.getElementById("UPDedad").value),
        genero: document.querySelector('input[name="UPDgenero"]:checked') ? document.querySelector('input[name="UPDgenero"]:checked').value : "",
        preferencias: Array.from(document.querySelectorAll('input[name="UPDpreferencia"]:checked')).map(el => el.value),
        describete: document.getElementById("UPDdescribete").value
    };

    // Validar datos antes de actualizar
    if (!validarDatos(persona)) return;

    try {
        await actualizarPersona(id, persona);
        alert("Persona actualizada con éxito");
        cancelarActualizacion();
        traerDatos();
    } catch (error) {
        console.error("Error al actualizar persona: ", error);
        alert("Error al actualizar persona");
    }
};


// Función para cancelar la actualización y volver al formulario de registro
const cancelarActualizacion = () => {
    document.getElementById("registroFormContainer").style.display = "block"; // Mostrar el formulario de registro
    document.getElementById("actualizarFormContainer").style.display = "none"; // Ocultar el formulario de actualización
    document.getElementById("btnActualizar").dataset.id = ""; // Limpiar el ID del botón de actualizar
};

// Función para traer los datos de personas registradas y mostrarlas en la tabla
const traerDatos = async () => {
    try {
        const personas = await obtenerPersonas(); // Obtener la lista de personas
        const tbody = document.querySelector("#tbPersonas tbody");
        tbody.innerHTML = ""; // Limpiar el contenido del cuerpo de la tabla

        personas.forEach((persona) => {
            const tr = document.createElement("tr");

            // Crear una fila de tabla con los datos de la persona
            tr.innerHTML = `
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.telefono}</td>
                <td>${persona.email}</td>
                <td>${persona.rut}</td>
                <td>${persona.edad}</td>
                <td>${persona.genero}</td>
                <td>${persona.preferencias.join(", ")}</td>
                <td>${persona.describete}</td>
                <td><button class="btn-editar" onclick="editar('${persona.id}')">Editar</button></td>
                <td><button class="btn-eliminar" data-id="${persona.id}">Eliminar</button></td>
            `;

            tbody.appendChild(tr); // Añadir la fila a la tabla
        });

        // Adjuntar evento de eliminación a los botones de eliminar
        const btnsEliminar = document.querySelectorAll(".btn-eliminar");
        btnsEliminar.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id; // Obtener el ID de la persona a eliminar
                eliminar(id); // Llamar a la función de eliminar
            });
        });
    } catch (error) {
        console.error("Error al traer datos: ", error); // Mostrar error en la consola
        alert("Error al traer datos"); // Mostrar mensaje de error
    }
};

// Función para limpiar el formulario de registro
const limpiarFormulario = () => {
    document.getElementById("registroForm").reset(); // Reiniciar el formulario
};

// Función para eliminar una persona
function eliminar(id) {
    // Mostrar un mensaje de confirmación
    const confirmacion = confirm("¿Estás seguro de que quieres eliminar esta persona?");

    if (confirmacion) {
        try {
            eliminarPersona(id)
                .then(() => {
                    alert("Persona eliminada con éxito"); // Mostrar mensaje de éxito
                    traerDatos(); // Actualizar la lista de personas
                })
                .catch(error => {
                    console.error("Error al eliminar persona: ", error); // Mostrar error en la consola
                    alert("Error al eliminar persona"); // Mostrar mensaje de error
                });
        } catch (error) {
            console.error("Error al eliminar persona: ", error); // Mostrar error en la consola
            alert("Error al eliminar persona"); // Mostrar mensaje de error
        }
    } else {
        // El usuario canceló la eliminación
        console.log("Eliminación cancelada");
    }
}

// Función para editar una persona
window.editar = async (id) => {
    try {
        const personas = await obtenerPersonas(); // Obtener la lista de personas
        const persona = personas.find(persona => persona.id === id); // Buscar la persona por su ID

        if (persona) {
            mostrarFormularioActualizar(id, persona); // Mostrar el formulario de actualización con los datos de la persona
        } else {
            alert("Persona no encontrada"); // Mostrar mensaje de error si la persona no se encuentra
        }
    } catch (error) {
        console.error("Error al editar persona: ", error); // Mostrar error en la consola
        alert("Error al editar persona"); // Mostrar mensaje de error
    }
};
