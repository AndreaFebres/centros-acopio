/**
 * MIS-CENTROS.JS — TUS CENTROS (los que agregas tú, no la comunidad)
 * ================================================================
 * Aquí agregas centros TÚ misma, sin usar la Google Form y sin tocar
 * ningún otro archivo. Puedes agregar varios de una vez.
 *
 * La Google Form sigue funcionando aparte para la comunidad: esto NO
 * la reemplaza, es solo para ti.
 *
 * --- PARA AGREGAR UN CENTRO ---
 * Copia este bloque completo (con las llaves { } y la coma del final)
 * y pégalo dentro de los corchetes [ ] de abajo:
 *
 *   {
 *     nombre: "Nombre del centro",
 *     pais: "Venezuela",
 *     ciudad: "Caracas",
 *     direccion: "Dirección completa",
 *     horario: "Lun a Vie 9am-4pm",   // si no sabes, deja ""
 *     contacto: "0412-1234567",        // si no hay, deja ""
 *     insumos: "Agua, alimentos, ropa",// separa con comas
 *     urgente: "Agua, medicinas",      // lo MÁS urgente ahora (opcional)
 *     necesitaVoluntarios: true,       // true (sí) o false, opcional
 *     tareasVoluntarios: "Empacar cajas", // para qué, opcional
 *     fecha: "28/06",                   // fecha del pedido, opcional
 *   },
 *
 * Para agregar VARIOS, repite el bloque, uno debajo del otro.
 *
 * REGLAS para no romper nada:
 *  - Solo "nombre", "pais", "ciudad" y "direccion" son obligatorios.
 *  - "horario", "contacto" e "insumos" son opcionales (deja "" si no).
 *  - El tipo (internacional / dentro de Venezuela) se calcula solo
 *    según el país: si pones "Venezuela" -> dentro de Venezuela.
 *  - No borres las comillas, las llaves { } ni las comas.
 *  - Estos centros aparecen como oficiales (NO llevan el aviso de
 *    "sin verificar"), porque los pones tú.
 * ================================================================
 */

const MIS_CENTROS = [

  // Ejemplo (puedes borrarlo). Copia este bloque para agregar más:
  // {
  //   nombre: "Iglesia San José — punto de acopio",
  //   pais: "Venezuela",
  //   ciudad: "Valencia, Carabobo",
  //   direccion: "Av. Bolívar, sector Naguanagua",
  //   horario: "Lun a Sáb 8am-4pm",
  //   contacto: "0414-0000000",
  //   insumos: "Agua, alimentos, medicinas, ropa",
  // },

  // ===== Nuevos centros agregados de prensa (27/06/2026) =====

  // --- MÉXICO ---
  {
    nombre: "Brigada de Rescate Topos Tlatelolco",
    pais: "México",
    ciudad: "Ciudad de México (Iztapalapa)",
    direccion: "Magistrados 75, Col. Ampliación El Sifón, Iztapalapa, C.P. 09180",
    horario: "",
    contacto: "",
    insumos: "Agua, alimentos no perecederos, artículos de higiene, equipo para rescatistas",
  },
  {
    nombre: "Embajada de Venezuela en México / Coordinadora Mexicana de Solidaridad",
    pais: "México",
    ciudad: "Ciudad de México (Miguel Hidalgo)",
    direccion: "Calle Schiller 326, Col. Chapultepec Morales (Polanco), Alcaldía Miguel Hidalgo",
    horario: "10:00am a 5:00pm",
    contacto: "",
    insumos: "Medicamentos, insumos médicos, artículos de emergencia, higiene personal, alimentos no perecederos",
  },

  // --- COLOMBIA (Bogotá) ---
  {
    nombre: "Fundación Juntos Se Puede — Hotel Matisse",
    pais: "Colombia",
    ciudad: "Bogotá (Chapinero)",
    direccion: "Carrera 13 #63-21, local 111, Chapinero, Bogotá",
    horario: "8:00am a 8:00pm",
    contacto: "",
    insumos: "Agua, alimentos no perecederos, higiene personal, insumos médicos, ropa",
  },
  {
    nombre: "Fundación Juntos Se Puede — Chapinero",
    pais: "Colombia",
    ciudad: "Bogotá (Chapinero)",
    direccion: "Carrera 9 #61-70, Chapinero, Bogotá",
    horario: "9:00am a 7:00pm",
    contacto: "",
    insumos: "Agua, alimentos no perecederos, higiene personal, insumos médicos, ropa",
  },

  // --- VENEZUELA (nuevos) ---
  {
    nombre: "Tatas Food — Centro de acopio",
    pais: "Venezuela",
    ciudad: "Barquisimeto, Lara",
    direccion: "Carrera 15 entre calles 13A y 13B, Barquisimeto",
    horario: "",
    contacto: "",
    insumos: "Agua potable, alimentos no perecederos, insumos médicos, ropa",
  },
  {
    nombre: "Voluntad Popular Monagas",
    pais: "Venezuela",
    ciudad: "Maturín, Monagas",
    direccion: "Calle 6, antigua Bermúdez, casa N.º 11 (antiguo restaurante El Oeste), Maturín",
    horario: "",
    contacto: "",
    insumos: "Agua potable, gasas, alcohol, algodón, jeringas, ropa, comida no perecedera",
  },
  {
    nombre: "Un Nuevo Tiempo (UNT) Zulia — sede regional",
    pais: "Venezuela",
    ciudad: "Maracaibo, Zulia",
    direccion: "Sede regional de Un Nuevo Tiempo, Zulia",
    horario: "",
    contacto: "",
    insumos: "Agua potable, alimentos no perecederos, insumos médicos, ropa, mantas",
  },
  {
    nombre: "Comando ConVzla — Bolívar",
    pais: "Venezuela",
    ciudad: "Ciudad Bolívar, Bolívar",
    direccion: "Esquina de Banesco, avenida República, municipio Angostura del Orinoco",
    horario: "",
    contacto: "",
    insumos: "Agua potable, alimentos no perecederos, insumos médicos, ropa",
  },

];
