/**
 * INSUMOS.JS — LISTA DE LO MÁS NECESITADO
 * ================================================================
 * Edita este archivo para cambiar los insumos. No toques nada más.
 * CÓMO AGREGAR: copia una línea { es: "...", en: "..." }, y pégala.
 * CÓMO QUITAR: borra la línea completa.
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
    titulo: "🔧 Herramientas",
    titulo_en: "🔧 Tools",
    nota: "Las herramientas portátiles (a batería) son especialmente útiles. Se necesitan extensiones eléctricas industriales.",
    nota_en: "Portable (battery-powered) tools are especially useful. Industrial extension cords are needed.",
    items: [
      { es: "Taladros portátiles (a batería)", en: "Portable drills (battery-powered)" },
      { es: "Discos de corte", en: "Cutting discs" },
      { es: "Amoladoras (también portátiles)", en: "Angle grinders (portable preferred)" },
      { es: "Sierras manuales y eléctricas", en: "Hand and electric saws" },
      { es: "Palas, picos y barras", en: "Shovels, pickaxes and crowbars" },
      { es: "Mazos y martillos", en: "Sledgehammers and hammers" },
      { es: "Extensiones eléctricas industriales", en: "Industrial extension cords" },
      { es: "Carretillas", en: "Wheelbarrows" },
      { es: "Bolsas de trabajo y herramientas manuales", en: "Tool bags and hand tools" },
    ],
  },
  {
    titulo: "💧 Agua potable",
    titulo_en: "💧 Drinking water",
    aviso: "⚠️ NO DONAR AGUA (por ahora) NI JUGOS TETRAPACK CON PITILLOS SI ESTÁS FUERA DEL PAÍS",
    aviso_en: "⚠️ DO NOT DONATE WATER (for now) OR TETRAPACK JUICES WITH STRAWS IF YOU ARE OUTSIDE THE COUNTRY",
    items: [
      { es: "Agua embotellada sellada (solo si estás en Venezuela)", en: "Sealed bottled water (only if you're in Venezuela)" },
      { es: "Bidones o garrafas de agua (solo si estás en Venezuela)", en: "Water jugs or containers (only if in Venezuela)" },
      { es: "Pastillas potabilizadoras", en: "Water purification tablets" },
    ],
  },
  {
    titulo: "💊 Suero y electrolitos",
    titulo_en: "💊 Fluids and electrolytes",
    items: [
      { es: "Suero oral (sobres y botellas)", en: "Oral rehydration salts (sachets and bottles)" },
      { es: "Suero fisiológico (para uso médico)", en: "Physiological saline (for medical use)" },
      { es: "Electrolitos en polvo o líquido", en: "Electrolytes in powder or liquid form" },
      { es: "Pedialyte y similares", en: "Pedialyte and similar products" },
    ],
  },
  {
    titulo: "🏥 Insumos médicos y primeros auxilios",
    titulo_en: "🏥 Medical and first-aid supplies",
    items: [
      { es: "Kits de primeros auxilios", en: "First-aid kits" },
      { es: "Gasas, vendas y alcohol", en: "Gauze, bandages and alcohol" },
      { es: "Guantes de látex", en: "Latex gloves" },
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
    titulo: "🛏️ Abrigo, refugio y descanso",
    titulo_en: "🛏️ Shelter, warmth and rest",
    items: [
      { es: "Carpas y casas de campaña", en: "Tents and camping shelters" },
      { es: "Sleeping bags (bolsas de dormir)", en: "Sleeping bags" },
      { es: "Cobijas y mantas", en: "Blankets" },
      { es: "Sábanas y toallas (sí se necesitan)", en: "Sheets and towels (needed)" },
    ],
  },
  {
    titulo: "👕 Ropa",
    titulo_en: "👕 Clothing",
    aviso: "⚠️ POR AHORA NO DONAR ROPA (EXCEPTO SÁBANAS Y TOALLAS). Solo ropa limpia y en buen estado cuando se habilite.",
    aviso_en: "⚠️ DO NOT DONATE CLOTHING FOR NOW (EXCEPT SHEETS AND TOWELS). Only clean clothing in good condition when enabled.",
    items: [
      { es: "Sábanas (sí se aceptan)", en: "Sheets (accepted)" },
      { es: "Toallas (sí se aceptan)", en: "Towels (accepted)" },
      { es: "Ropa limpia en buen estado (cuando se habilite)", en: "Clean clothing in good condition (when enabled)" },
    ],
  },
  {
    titulo: "🐾 Mascotas y animales",
    titulo_en: "🐾 Pets and animals",
    items: [
      { es: "Comida para perros y gatos (seca o en lata)", en: "Dog and cat food (dry or canned)" },
      { es: "Platos de comida y agua para animales", en: "Food and water bowls for animals" },
      { es: "Collares para perros y pecheras", en: "Dog collars and harnesses" },
      { es: "Medicinas para animales", en: "Animal medicines" },
      { es: "Correas", en: "Leashes" },
    ],
  },
];
