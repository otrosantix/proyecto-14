import { DateTime } from 'luxon';

// Formato en que se muestra y se lee la fecha
const DATE_FORMAT = 'dd/MM/yyyy';

// Guardamos los elementos del HTML que vamos a usar
const formulario = document.querySelector('#FormularioEdad');
const inputFecha = document.querySelector('#fechaNacimiento');
const contenedorEdad = document.querySelector('#ContenedorEdad');

// ---------- Datepicker ----------
datepicker(inputFecha, {
    // Cómo se escribe la fecha dentro del input cuando el usuario la elige
    formatter: (input, date) => {
        input.value = DateTime.fromJSDate(date).toFormat(DATE_FORMAT);
    },
    // No dejamos elegir fechas futuras
    maxDate: new Date(),
    // Calendario en español
    customDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    customMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    overlayPlaceholder: 'Año (4 dígitos)',
    overlayButton: 'Ir'
});

// Mostrar mensajes
// Función auxiliar para no repetir código al mostrar errores o resultados
function mostrarMensaje(texto, esError) {
    contenedorEdad.textContent = texto;
    // Si es error le ponemos la clase "Error" (definida en el CSS), si no la quitamos
    contenedorEdad.classList.toggle('Error', esError);
}

//Cálculo de la edad
formulario.addEventListener('submit', (evento) => {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    const textoFecha = inputFecha.value;

    // Validación 1: que el usuario haya elegido una fecha
    if (textoFecha === '') {
        mostrarMensaje('Por favor seleccione su fecha de nacimiento.', true);
        return;
    }

    // Convertimos el texto "dd/MM/yyyy" a un objeto DateTime de Luxon
    const nacimiento = DateTime.fromFormat(textoFecha, DATE_FORMAT);
    const hoy = DateTime.now();

    // Validación 2: que Luxon pueda interpretar la fecha
    if (!nacimiento.isValid) {
        mostrarMensaje('La fecha ingresada no es válida.', true);
        return;
    }

    // Validación 3: que la fecha no sea futura
    if (nacimiento > hoy) {
        mostrarMensaje('La fecha de nacimiento no puede ser futura.', true);
        return;
    }

    // diff calcula la diferencia entre hoy y el nacimiento,
    // separada en años, meses y días
    const edad = hoy.diff(nacimiento, ['years', 'months', 'days']).toObject();

    // Los días vienen con decimales (horas), así que los redondeamos hacia abajo
    const anios = edad.years;
    const meses = edad.months;
    const dias = Math.floor(edad.days);

    // Mostramos el resultado en la misma página
    mostrarMensaje(`Tienes ${anios} años, ${meses} meses y ${dias} días`, false);
});
