/**
 * REFUGIOS-DATA.JS — REFUGIOS Y ALBERGUES TEMPORALES (todos en Venezuela)
 * ================================================================
 * Editas este archivo para agregar refugios tú misma. Todos son en
 * Venezuela, por eso no se pide país.
 *
 * --- PARA AGREGAR UNO ---
 * Copia este bloque (con la coma final) y pégalo dentro de los [ ]:
 *
 *   {
 *     nombre: "Nombre del refugio o institución",
 *     ciudad: "Caracas",
 *     direccion: "Dirección completa",
 *     horario: "8am a 6pm",        // si no sabes, deja ""
 *     contacto: "0212-0000000",    // si no hay, deja ""
 *     recibeDonaciones: true,      // true (sí) o false (no)
 *     necesita: "Colchonetas, agua, comida", // qué necesita ahora
 *     necesitaVoluntarios: true,   // true (sí) o false (no)
 *     tareasVoluntarios: "Cocina, cargar cajas", // para qué, opcional
 *     fecha: "28/06",                   // fecha del pedido, opcional
 *     lat: 10.50, lng: -66.91,     // opcional, para el mapa
 *   },
 *
 * Solo "nombre", "ciudad" y "direccion" son obligatorios.
 * No borres las comillas, las llaves { } ni las comas.
 *
 * Para que aparezca en el MAPA necesita lat y lng. Para sacarlas:
 * abre Google Maps, clic derecho sobre el punto, copia los números.
 *
 * SUGERENCIAS DE LA COMUNIDAD:
 * Pega el link CSV publicado de la hoja de respuestas de tu Google
 * Form de refugios en REF_SHEET_CSV_URL y las respuestas aparecen solas.
 * ================================================================
 */

// CSV publicado de la hoja de respuestas (ver README). Mientras diga
// PEGA_AQUI, simplemente no se activa esa función.
const REF_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfAF2RFmTOouE6cYMyWC2vnciPN6cHUN1bLr5IBYuoQl0gsDwQYsx0NJlI6BIAZVWCZZDaLPc0v45a/pub?output=csv";

// Google Form para que la comunidad sugiera refugios.
const REF_FORM_URL = "https://forms.gle/Hnh4Tn6RaCJ83z398";

// ================================================================
// REFUGIOS DE MASCOTAS
// ================================================================
// CSV del formulario de mascotas
const MASC_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1DNN3d4arUnB6lc-8Rw1FxWs5zoLHkY5XVG1lEsdErjPa5OetTGONtxxmylMGLFsztZI3pOUrsjHy/pub?output=csv";

// Formulario para sugerir refugios de mascotas
const MASC_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScsSqRFRZx-Y3dURU-XMa3elow4HBfD92R7VxXMu1FgOecsaQ/viewform";

// Refugios de mascotas precargados (agrega aquí los verificados de prensa)
// Formato:
//   {
//     nombre: "Laika Arkadia",
//     ciudad: "Medellín",
//     direccion: "Cra. 70 #1-141 local 9822",
//     mascotas: "Perros y gatos",
//     horario: "8am-5pm",
//     contacto: "0412-0000000",
//     recibeDonaciones: true,
//     necesita: "Comida para perros, jaulas",
//     nota: "",
//   },
const MASCOTAS_DATA = [

];

// Empieza vacía: se llena con el formulario y con los que agregues aquí.
const REFUGIOS_DATA = [

];
