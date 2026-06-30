/**
 * APOYO-DATA.JS — RECURSOS DE APOYO (categoría amplia)
 * ================================================================
 * Cualquier tipo de apoyo: psicológico, legal, económico, ONGs,
 * orientación, etc. No solo psicológico.
 *
 * --- PARA AGREGAR UNO ---
 * Copia este bloque (con la coma final) y pégalo dentro de los [ ]:
 *
 *   {
 *     nombre: "Nombre del servicio o institución",
 *     categoria: "Psicológico",     // Psicológico, Legal, Económico, Otro
 *     pais: "Venezuela",            // opcional
 *     ciudad: "Caracas",             // opcional
 *     direccion: "",                 // opcional, si es presencial
 *     contacto: "0424-0000000",      // teléfono o WhatsApp
 *     tipo: "Qué apoyo brinda (psicológico, legal, etc.)",
 *     horario: "Lun a Vie 8am-6pm",  // opcional
 *     nota: "",                       // info extra, opcional
 *   },
 *
 * Solo "nombre" es obligatorio. No borres comillas, llaves ni comas.
 *
 * SUGERENCIAS DE LA COMUNIDAD:
 * Pega el link CSV publicado de tu Google Form en APOYO_SHEET_CSV_URL.
 * ================================================================
 */

const APOYO_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzgyv92O0c1srJc1yJ_3ybjM8QEenEWnwkAAG89JFc65owj-mOKt9_lXWn1VZb0MqhPacD7awajWMK/pub?output=csv";

// Google Form para que la comunidad sugiera recursos de apoyo.
const APOYO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScK2mBzD5n1C8ylv_rmaXunUdGpYvrcleq1ZwOfX2uDFV9vPg/viewform";

const APOYO_DATA = [
  // Recopilados de prensa y fuentes oficiales (FPV, UCAB, RNV) 25-28/06/2026.
  {
    nombre: "LAPSI — Línea de Ayuda Psicológica (FPV)",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "+58 424-290-7338",
    tipo: "Apoyo psicológico telefónico, gratuito (solo pagas la llamada). Primeros auxilios psicológicos e intervención en crisis.",
    horario: "Viernes a domingo, 8:00am a 8:00pm",
    nota: "Federación de Psicólogos de Venezuela.",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "PsicoLínea UCAB",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "0414-121-7882 · 0424-172-3981",
    tipo: "Apoyo psicológico telefónico, gratuito, anónimo y confidencial. Primeros auxilios psicológicos e intervención en crisis.",
    horario: "",
    nota: "Escuela de Psicología de la UCAB (PsicoData).",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "Línea Nacional 0800-AYUDA-01",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "0800-AYUDA-01",
    tipo: "Apoyo psicológico telefónico, gratuito, nivel nacional. Psicólogos y psiquiatras.",
    horario: "",
    nota: "Línea oficial de atención en salud mental.",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "SEAPSI — Atención Psicológica Integral (FPV)",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "WhatsApp +58 424-204-1281",
    tipo: "Terapia psicológica presencial o a distancia, a tarifas solidarias. Niños, adolescentes, adultos, parejas y familias.",
    horario: "Lunes a viernes, 8:00am a 6:00pm",
    nota: "Federación de Psicólogos de Venezuela. Correo: seapsi@fpv.org.ve",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "PPV — Programa de Psicólogos Voluntarios (FPV)",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "Solicitud por formulario en fpv.org.ve/servicios",
    tipo: "Apoyo psicoemocional y atención en emergencia, con psicólogos certificados.",
    horario: "",
    nota: "Llenas un formulario y te contactan según disponibilidad.",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "Comunidad Calmadamente (FPV)",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "Inscripción por formulario en fpv.org.ve/servicios",
    tipo: "Comunidad virtual para aprender a gestionar la ansiedad, enfoque cognitivo conductual.",
    horario: "",
    nota: "Espacio de acompañamiento grupal, no es atención individual.",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "FIPE-IFEP — Psicología de la Emergencia",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "Ver canales oficiales de FIPE-IFEP",
    tipo: "Contención emocional y orientación psicológica inicial, gratuita.",
    horario: "",
    nota: "Federación Internacional de Psicología de la Emergencia.",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
  {
    nombre: "Save the Children — Apoyo psicosocial",
    categoria: "Psicológico",
    pais: "Venezuela",
    ciudad: "",
    direccion: "",
    contacto: "savethechildren.es",
    tipo: "Apoyo psicosocial enfocado en niños y familias afectadas.",
    horario: "",
    nota: "Organización internacional presente en Venezuela.",
    necesitaVoluntarios: false,
    tipoVoluntarios: "",
  },
];
