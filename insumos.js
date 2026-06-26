/**
 * INSUMOS.JS — LISTA DE LO MÁS NECESITADO
 * ================================================================
 * Este es el ÚNICO archivo que editas para cambiar los insumos.
 * No necesitas tocar nada más.
 *
 * CÓMO FUNCIONA:
 * Cada categoría tiene un título (titulo / titulo_en) y una lista
 * de cosas (items). Cada cosa tiene su versión en español (es) y
 * en inglés (en).
 *
 * --- PARA AGREGAR UNA COSA A UNA CATEGORÍA ---
 * Copia una línea como esta (incluida la coma al final):
 *     { es: "Velas y fósforos", en: "Candles and matches" },
 * y pégala dentro de los [ ] de la categoría que quieras.
 *
 * --- PARA QUITAR UNA COSA ---
 * Borra su línea completa.
 *
 * --- PARA AGREGAR UNA CATEGORÍA NUEVA ---
 * Copia un bloque entero { titulo: ... items: [ ... ] }, (con su
 * coma al final) y pégalo donde quieras en la lista.
 *
 * --- PARA QUE UNA CATEGORÍA APAREZCA ABIERTA AL CARGAR ---
 * Ponle    abierta: true,    (solo recomendado para la primera).
 *
 * NOTA: si no sabes inglés, deja el "en" igual que el "es", no pasa
 * nada. Lo importante es no borrar las comillas, las llaves { } ni
 * las comas.
 * ================================================================
 */

const INSUMOS = [
  {
    titulo: "⛑️ Implementos de rescate (lo más urgente)",
    titulo_en: "⛑️ Rescue equipment (most urgent)",
    abierta: true,
    items: [
      { es: "Cascos de seguridad", en: "Safety helmets" },
      { es: "Guantes de trabajo resistentes", en: "Heavy-duty work gloves" },
      { es: "Martillos, picos y palas", en: "Hammers, pickaxes and shovels" },
      { es: "Chalecos reflectantes", en: "Reflective vests" },
      { es: "Cuerdas y lonas resistentes", en: "Ropes and heavy-duty tarps" },
      { es: "Mascarillas para polvo y escombros", en: "Dust/debris masks" },
    ],
  },
  {
    titulo: "💧 Agua potable",
    titulo_en: "💧 Drinking water",
    items: [
      { es: "Agua embotellada sellada", en: "Sealed bottled water" },
      { es: "Bidones o garrafas de agua", en: "Water jugs or containers" },
      { es: "Pastillas potabilizadoras", en: "Water purification tablets" },
    ],
  },
  {
    titulo: "🏥 Insumos médicos y primeros auxilios",
    titulo_en: "🏥 Medical and first-aid supplies",
    items: [
      { es: "Kits de primeros auxilios", en: "First-aid kits" },
      { es: "Gasas, vendas y alcohol", en: "Gauze, bandages and alcohol" },
      { es: "Guantes de látex y suero fisiológico", en: "Latex gloves and IV saline" },
      { es: "Analgésicos (acetaminofén, ibuprofeno)", en: "Pain relievers (acetaminophen, ibuprofen)" },
      { es: "Antibióticos y antisépticos", en: "Antibiotics and antiseptics" },
    ],
  },
  {
    titulo: "🥫 Alimentos no perecederos",
    titulo_en: "🥫 Non-perishable food",
    items: [
      { es: "Enlatados (atún, sardinas, granos)", en: "Canned goods (tuna, sardines, beans)" },
      { es: "Harina, arroz y pasta", en: "Flour, rice and pasta" },
      { es: "Aceite, azúcar y sal", en: "Oil, sugar and salt" },
      { es: "Barras energéticas y galletas", en: "Energy bars and crackers" },
      { es: "Verifica fechas de vencimiento", en: "Check expiration dates" },
    ],
  },
  {
    titulo: "👶 Bebés y niños",
    titulo_en: "👶 Babies and children",
    items: [
      { es: "Pañales de bebé (todas las tallas)", en: "Baby diapers (all sizes)" },
      { es: "Fórmula infantil", en: "Infant formula" },
      { es: "Toallitas húmedas", en: "Baby wipes" },
      { es: "Comida para bebé (compotas)", en: "Baby food (purees)" },
    ],
  },
  {
    titulo: "🧼 Higiene personal",
    titulo_en: "🧼 Personal hygiene",
    items: [
      { es: "Jabón de baño y de lavar", en: "Bath and laundry soap" },
      { es: "Toallas sanitarias", en: "Sanitary pads" },
      { es: "Pañales de adulto", en: "Adult diapers" },
      { es: "Cepillos y pasta dental", en: "Toothbrushes and toothpaste" },
      { es: "Papel higiénico y desodorante", en: "Toilet paper and deodorant" },
    ],
  },
  {
    titulo: "🔦 Luz y energía",
    titulo_en: "🔦 Light and power",
    items: [
      { es: "Linternas", en: "Flashlights" },
      { es: "Pilas (AA y AAA)", en: "Batteries (AA and AAA)" },
      { es: "Power banks (cargadores portátiles)", en: "Power banks" },
      { es: "Velas y fósforos", en: "Candles and matches" },
    ],
  },
  {
    titulo: "🛏️ Abrigo y refugio",
    titulo_en: "🛏️ Shelter and warmth",
    items: [
      { es: "Cobijas y mantas", en: "Blankets" },
      { es: "Carpas y casas de campaña", en: "Tents" },
      { es: "Suéteres y ropa de abrigo (prioridad)", en: "Sweaters and warm clothing (priority)" },
      { es: "Ropa limpia en buen estado", en: "Clean clothing in good condition" },
    ],
  },
  {
    titulo: "🐾 Mascotas",
    titulo_en: "🐾 Pets",
    items: [
      { es: "Comida para perros y gatos", en: "Dog and cat food" },
    ],
  },
];
