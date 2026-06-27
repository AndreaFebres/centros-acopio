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
 *     tipo: "Público",        // "Público" o "Privado"
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

const HOSP_SHEET_CSV_URL = "PEGA_AQUI_EL_LINK_CSV_DE_TU_GOOGLE_FORM_DE_HOSPITALES";

// Link de tu Google Form para que la comunidad sugiera hospitales.
// (Crea un formulario nuevo y pega aquí su link forms.gle/...)
const HOSP_FORM_URL = "PEGA_AQUI_TU_LINK_DE_GOOGLE_FORM_DE_HOSPITALES";

const HOSPITALES_DATA = [
  // Recopilados de prensa (Univisión, CNN, El Colombiano) el 25/06/2026.
  // Verifica disponibilidad antes de acudir, la situación cambia rápido.
  {
    nombre: "Hospital Dr. Domingo Luciani",
    tipo: "Público",
    ciudad: "Caracas (El Llanito)",
    direccion: "El Llanito, Caracas",
    telefono: "",
    nota: "Centro importante de recepción de heridos de Caracas y La Guaira.",
  },
  {
    nombre: "Hospital Periférico de Catia",
    tipo: "Público",
    ciudad: "Caracas (Catia)",
    direccion: "Catia, Caracas",
    telefono: "",
    nota: "Recibiendo heridos trasladados desde La Guaira.",
  },
  {
    nombre: "Hospital General Regional Dr. José María Vargas",
    tipo: "Público",
    ciudad: "La Guaira",
    direccion: "La Guaira",
    telefono: "",
    nota: "Principal hospital de La Guaira. Muy saturado: confirma antes de acudir.",
  },
  {
    nombre: "Clínica El Ávila",
    tipo: "Privado",
    ciudad: "Caracas (Altamira)",
    direccion: "Av. San Juan Bosco con 6ta transversal, Altamira",
    telefono: "0212-2761111",
    nota: "Atención priorizada a embarazadas y recién nacidos.",
  },
  {
    nombre: "Hospital de campaña — Catia La Mar",
    tipo: "Público",
    ciudad: "Catia La Mar, La Guaira",
    direccion: "Catia La Mar",
    telefono: "",
    nota: "Hospital de campaña instalado por la emergencia.",
  },
  {
    nombre: "Hospital de Morón",
    tipo: "Público",
    ciudad: "Morón, Carabobo",
    direccion: "Morón",
    telefono: "",
    nota: "Cercano al epicentro, atendiendo heridos.",
  },
];
