/**
 * CENTROS-DATA.JS
 * ----------------------------------------------------------------
 * Lista de centros de acopio. Los que ves abajo fueron recopilados
 * de reportes de prensa el 25/06/2026 tras los terremotos del 24/06
 * en Venezuela — verifica horarios antes de ir, la situación cambia
 * rápido. Edita, agrega o borra entradas según vayas confirmando.
 *
 * Cada centro es un objeto con estos campos:
 *
 *   id        : número único (no repetir)
 *   nombre    : nombre del centro / organización / parroquia
 *   tipo      : OPCIONAL. "internacional" o "nacional". Si lo omites,
 *               se calcula solo: país = Venezuela -> nacional,
 *               cualquier otro país -> internacional.
 *   pais      : país donde está ubicado
 *   ciudad    : ciudad y, si aplica, estado/provincia
 *   direccion : dirección legible para humanos
 *   lat, lng  : coordenadas (decimales). Para conseguirlas:
 *               abre Google Maps, click derecho sobre el punto -> copian
 *               las coordenadas, ej: 10.4806, -66.9036
 *   contacto  : teléfono, WhatsApp o email de contacto (opcional)
 *   horario   : horario de atención
 *   insumos   : arreglo de strings con lo que aceptan
 *   notas     : cualquier aclaración (opcional, ej: "solo medicinas selladas")
 *
 * Para AGREGAR un centro nuevo: copia un bloque completo {...},
 * pégalo antes del corchete final "]", cambia el id por uno que no
 * exista todavía, y rellena los datos reales.
 * ----------------------------------------------------------------
 */

// ============================================================
// SUGERENCIAS DE LA COMUNIDAD (vía tu Google Form)
// ------------------------------------------------------------
// Si pegas aquí el link CSV publicado de la hoja de respuestas de tu
// Google Form, las respuestas aparecen SOLAS en la página — marcadas
// como "Sin verificar" — sin que tengas que copiarlas a mano.
// Cómo conseguir ese link: ver el README, sección "Sugerencias
// automáticas". Si lo dejas como está, simplemente no se activa esta
// función y la página sigue funcionando normal con la lista de abajo.
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjAqjeZQ6lRTB0GuRzxbmq4SaR1Xs8DlOVz8iEeys7j2LCwvmCNrMNb1PQLCAnsycC5X7ZImiYQ3b2/pub?gid=913383518&single=true&output=csv";

// Fecha en que se verificó por última vez esta lista. Cámbiala cada vez
// que edites los datos, para que el pie de página muestre algo real.
const ULTIMA_ACTUALIZACION = "25 de junio de 2026";

const CENTROS_DATA = [
  // ===================== DORAL / MIAMI, ESTADOS UNIDOS =====================
  // Activados tras los terremotos del 24 de junio de 2026 en Venezuela.
  // Fuente: WSVN, Miami New Times, Univision, Infobae, Diario Las Américas (25/06/2026).
  {
    id: 1,
    nombre: "Global Empowerment Mission (GEM) / We Love Foundation",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Doral, FL",
    direccion: "1850 NW 84th Ave, Suite 100, Doral, FL 33126",
    lat: 25.7618,
    lng: -80.3553,
    contacto: "globalempowermentmission.org",
    horario: "Lun–Vie 9:00am–4:00pm",
    insumos: ["Alimentos no perecederos", "Agua embotellada", "Higiene personal", "Insumos médicos", "Donaciones monetarias (lo más solicitado)"],
    notas: "Sede principal de acopio masivo en Doral. Voluntarios bienvenidos en el mismo horario. Fuente: prensa, 25/06/2026.",
  },
  {
    id: 2,
    nombre: "Doral Legacy Park, Community Center",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Doral, FL",
    direccion: "11400 NW 82nd St, Doral, FL 33178",
    lat: 25.8316,
    lng: -80.3913,
    contacto: "(305) 341-3601",
    horario: "Lun–Vie 5:00pm–9:00pm · Sáb–Dom 8:00am–5:00pm",
    insumos: ["Alimentos no perecederos", "Agua", "Ropa", "Insumos médicos"],
    notas: "Punto de entrega habilitado por la Ciudad de Doral. Fuente: prensa, 25/06/2026.",
  },
  {
    id: 3,
    nombre: "El Arepazo Doral",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Doral, FL",
    direccion: "10191 NW 58th St, Doral, FL 33178",
    lat: 25.8055,
    lng: -80.3745,
    contacto: "—",
    horario: "Todos los días, 24 horas",
    insumos: ["Alimentos", "Agua", "Ropa", "Higiene personal"],
    notas: "Restaurante conocido de la comunidad venezolana, recibe donaciones a cualquier hora. Fuente: prensa, 25/06/2026.",
  },
  {
    id: 4,
    nombre: "Fundación AFE (Amor, Fe y Esperanza)",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Miami, FL",
    direccion: "6090 NW 84th Ave, Miami, FL 33166",
    lat: 25.8076,
    lng: -80.3553,
    contacto: "+1 305 602 4466",
    horario: "9:30am–3:00pm",
    insumos: ["Alimentos no perecederos", "Agua", "Higiene personal", "Ropa"],
    notas: "Fuente: Diario Las Américas, Univision, 25/06/2026.",
  },
  {
    id: 5,
    nombre: "Oficina de la Supervisora de Elecciones de Miami-Dade",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Doral, FL",
    direccion: "2700 NW 87th Ave, Doral, FL 33172",
    lat: 25.7990,
    lng: -80.3650,
    contacto: "—",
    horario: "Lun–Vie 8:00am–5:00pm · Sáb 27/06 8:00am–5:00pm",
    insumos: ["Alimentos no perecederos", "Agua", "Insumos médicos"],
    notas: "Punto de acopio habilitado en el vestíbulo de la oficina. Fuente: WSVN, 25/06/2026.",
  },
  {
    id: 6,
    nombre: "GEM, punto de acopio La Ceiba Tire Shop",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Miami, FL",
    direccion: "10815 NW 14th St, Miami, FL 33172",
    lat: 25.7890,
    lng: -80.3620,
    contacto: "globalempowermentmission.org",
    horario: "",
    insumos: ["Alimentos no perecederos", "Agua", "Insumos médicos"],
    notas: "Punto adicional de GEM. Fuente: Univision, 25/06/2026.",
  },
  {
    id: 7,
    nombre: "All For Venezuela",
    tipo: "internacional",
    pais: "Estados Unidos",
    ciudad: "Pembroke Pines, FL",
    direccion: "1391 NW 187th Ave, Pembroke Pines, FL 33029",
    lat: 26.0112,
    lng: -80.3658,
    contacto: "Coordinar con Mayra Marchán (ver redes @allforvzla)",
    horario: "",
    insumos: ["Medicamentos (Albuterol, Acetaminofén, Ibuprofeno pediátrico)", "Pañales", "Fórmula infantil"],
    notas: "Recolecta insumos médicos específicos solicitados por el Venezuelan American Caucus. Fuente: Univision/AOL, 25/06/2026.",
  },

  // ===================== QUITO, ECUADOR =====================
  // Operación Todos con VZLA. Fuente: La República, Expreso (25/06/2026).
  {
    id: 8,
    nombre: "Cachapas El Félix (punto de referencia)",
    tipo: "internacional",
    pais: "Ecuador",
    ciudad: "Quito",
    direccion: "Av. Naciones Unidas y Av. 10 de Agosto, Quito",
    lat: -0.1797,
    lng: -78.4869,
    contacto: "—",
    horario: "Desde las 11:00am",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos", "Ropa de abrigo"],
    notas: "Punto de Operación Todos con VZLA. Fuente: Expreso, 25/06/2026.",
  },
  {
    id: 9,
    nombre: "Edificio IQON",
    tipo: "internacional",
    pais: "Ecuador",
    ciudad: "Quito",
    direccion: "Av. de los Shyris y Suecia, sector La Carolina, Quito",
    lat: -0.1789,
    lng: -78.4836,
    contacto: "—",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos", "Ropa"],
    notas: "Dato aportado por la comunidad, confirma horario antes de ir.",
  },
  {
    id: 10,
    nombre: "Edificio Gaudí",
    tipo: "internacional",
    pais: "Ecuador",
    ciudad: "Quito",
    direccion: "Calle Checoslovaquia, Quito",
    lat: -0.1815,
    lng: -78.4825,
    contacto: "—",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos", "Guantes", "Mascarillas", "Linternas", "Pilas", "Pañales", "Cobijas"],
    notas: "Fuente: La República (Ecuador), 25/06/2026.",
  },

  // ===================== OTROS PAÍSES =====================
  {
    id: 11,
    nombre: "Fundación Juntos Se Puede",
    tipo: "internacional",
    pais: "Colombia",
    ciudad: "Bogotá",
    direccion: "Calle 104 #54-31, barrio Pasadena, Bogotá",
    lat: 4.6975,
    lng: -74.058,
    contacto: "—",
    horario: "Hasta el 1 de julio · desde las 7:00am",
    insumos: ["Agua potable", "Alimentos no perecederos", "Higiene personal", "Insumos médicos", "Pañales", "Ropa"],
    notas: "Fuente: El Tiempo, El País (Colombia), 25/06/2026.",
  },

  // ===================== DENTRO DE VENEZUELA =====================
  // Reportados por redes/medios tras los sismos del 24/06/2026. Verifica
  // siempre por canales oficiales antes de desplazarte, la situación
  // cambia muy rápido.
  {
    id: 12,
    nombre: "Comando ConVzla, Miranda",
    tipo: "nacional",
    pais: "Venezuela",
    ciudad: "Caracas (Altamira), Miranda",
    direccion: "4ta avenida de Altamira, entre 9na y 10ma transversal, quinta El Bejucal",
    lat: 10.499,
    lng: -66.853,
    contacto: "—",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos", "Ropa"],
    notas: "Fuente: El Pitazo, 25/06/2026.",
  },
  {
    id: 13,
    nombre: "Comando ConVzla, Aragua",
    tipo: "nacional",
    pais: "Venezuela",
    ciudad: "Maracay, Aragua",
    direccion: "Av. 19 de Abril, C.C. La Capilla, piso 1, local 21, Maracay",
    lat: 10.2462,
    lng: -67.5926,
    contacto: "—",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos", "Ropa"],
    notas: "Fuente: El Pitazo, 25/06/2026.",
  },
  {
    id: 14,
    nombre: "ULA Táchira",
    tipo: "nacional",
    pais: "Venezuela",
    ciudad: "San Cristóbal, Táchira",
    direccion: "Núcleo Universidad de Los Andes, San Cristóbal",
    lat: 7.7669,
    lng: -72.225,
    contacto: "—",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Ropa en buen estado"],
    notas: "Fuente: redes sociales / prensa, 25/06/2026.",
  },
  {
    id: 15,
    nombre: "Voluntad Popular / Comando ConVzla, Carabobo",
    tipo: "nacional",
    pais: "Venezuela",
    ciudad: "Valencia, Carabobo",
    direccion: "Av. Mons. Adams, El Viñedo, Edif. Talislandia, mezzanina",
    lat: 10.187,
    lng: -67.985,
    contacto: "—",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos", "Ropa"],
    notas: "Fuente: El Pitazo, 25/06/2026.",
  },
  {
    id: 16,
    nombre: "Cáritas Barquisimeto",
    tipo: "nacional",
    pais: "Venezuela",
    ciudad: "Barquisimeto, Lara",
    direccion: "Carrera 18, entre calles 34 y 35, Barquisimeto",
    lat: 10.07,
    lng: -69.323,
    contacto: "0251-446-8402",
    horario: "",
    insumos: ["Agua potable", "Alimentos no perecederos", "Insumos médicos"],
    notas: "Fuente: Noticiero Promar TV, 25/06/2026.",
  },
];
