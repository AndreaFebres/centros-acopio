/**
 * HOSPITALES-DATA.JS — HOSPITALES Y CLÍNICAS QUE ESTÁN ATENDIENDO
 * ================================================================
 * Editas este archivo para cambiar la lista de hospitales/clínicas.
 *
 * --- PARA AGREGAR UNO ---
 * Copia este bloque completo (con la coma final) y pégalo dentro de
 * los corchetes [ ]:
 *
 *   {
 *     nombre: "Nombre del hospital o clínica",
 *     ciudad: "Caracas",
 *     direccion: "Dirección o zona",
 *     telefono: "0212-0000000", // si no hay, deja ""
 *     nota: "",                  // ej: "Solo emergencias", opcional
 *   },
 *
 * Solo "nombre" y "ciudad" son obligatorios. Lo demás opcional.
 * No borres las comillas, las llaves { } ni las comas.
 *
 * SUGERENCIAS DE LA COMUNIDAD:
 * Igual que en la página de centros, si pegas el link CSV publicado
 * de la hoja de respuestas de tu Google Form de hospitales en la
 * línea de abajo, las respuestas aparecen solas.
 * ================================================================
 */

const HOSP_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZrHgu9r-DeaVhnAW6RSYityh7BzWwAD62vgzBw0wFCiFwYJkSAfzcnwRMMaKQ_CM0e310xLQEoH4Q/pub?output=csv";

// Link de tu Google Form para que la comunidad sugiera hospitales.
// (Crea un formulario nuevo y pega aquí su link forms.gle/...)
const HOSP_FORM_URL = "https://forms.gle/M3cCtdQ127D8ZhjR7";

const HOSPITALES_DATA = [
  // Red oficial activada por el Ministerio de Salud: 8 hospitales
  // públicos + 12 clínicas privadas en la Gran Caracas. Recopilados de
  // prensa (CNN, AVN, La Nación, LatinUS) el 25-27/06/2026.
  // Verifica disponibilidad antes de acudir, muchos están saturados.

  // ===== CARACAS (hospitales públicos de la red activada) =====
  {
    nombre: "Hospital Vargas de Caracas",
    ciudad: "Caracas",
    direccion: "San José, Caracas",
    telefono: "",
    nota: "Hospital de la red oficial. Recibe muchos pacientes de la región costera.",
  },
  {
    nombre: "Hospital Dr. Domingo Luciani",
    ciudad: "Caracas (El Llanito)",
    direccion: "El Llanito, Caracas",
    telefono: "",
    nota: "Centro importante de recepción de heridos de Caracas y La Guaira.",
  },
  {
    nombre: "Hospital Periférico de Catia (Dr. José Gregorio Hernández)",
    ciudad: "Caracas (Catia)",
    direccion: "Catia, Caracas",
    telefono: "",
    nota: "Recibiendo heridos trasladados desde La Guaira.",
  },
  {
    nombre: "Hospital Los Magallanes de Catia",
    ciudad: "Caracas (Catia)",
    direccion: "Los Magallanes de Catia, Caracas",
    telefono: "",
    nota: "Hospital de la red oficial activada.",
  },
  {
    nombre: "Hospital El Algodonal",
    ciudad: "Caracas (Antímano)",
    direccion: "Antímano, Caracas",
    telefono: "",
    nota: "Hospital de la red oficial activada.",
  },
  {
    nombre: "Hospital de Lídice (Dr. Jesús Yerena)",
    ciudad: "Caracas (Lídice)",
    direccion: "Lídice, Caracas",
    telefono: "",
    nota: "Hospital de la red oficial activada.",
  },
  {
    nombre: "Hospital Militar Dr. Carlos Arvelo",
    ciudad: "Caracas (San Martín)",
    direccion: "Av. José Ángel Lamas, San Martín, Caracas",
    telefono: "",
    nota: "Hospital militar de la red oficial activada.",
  },

  // ===== CLÍNICAS PRIVADAS =====
  {
    nombre: "Clínica El Ávila",
    ciudad: "Caracas (Altamira)",
    direccion: "Av. San Juan Bosco con 6ta transversal, Altamira",
    telefono: "0212-2761111",
    nota: "Atención priorizada a embarazadas y recién nacidos.",
  },

  // ===== LA GUAIRA (la zona más afectada) =====
  {
    nombre: "Hospital General Dr. José María Vargas (La Guaira)",
    ciudad: "La Guaira",
    direccion: "La Guaira",
    telefono: "",
    nota: "Principal hospital de La Guaira. Muy saturado: confirma antes de acudir.",
  },
  {
    nombre: "Clínica Comunitaria Alfredo Machado",
    ciudad: "Catia La Mar, La Guaira",
    direccion: "Catia La Mar, La Guaira",
    telefono: "",
    nota: "Convertida en centro de triaje para la emergencia.",
  },
  {
    nombre: "Hospitales de campaña de la ONU (3)",
    ciudad: "La Guaira",
    direccion: "Estado La Guaira",
    telefono: "",
    nota: "Tres hospitales de campaña instalados por Naciones Unidas para atender en la zona sin trasladar a todos a Caracas.",
  },
  {
    nombre: "Hospitales Quirúrgicos Móviles (FANB)",
    ciudad: "La Guaira",
    direccion: "Estado La Guaira (unidades móviles)",
    telefono: "",
    nota: "Unidades militares de campaña con capacidad para cirugías de emergencia.",
  },

  // ===== OTROS ESTADOS =====
  {
    nombre: "Hospital de Morón",
    ciudad: "Morón, Carabobo",
    direccion: "Morón, Carabobo",
    telefono: "",
    nota: "Cercano al epicentro, atendiendo heridos.",
  },
];
