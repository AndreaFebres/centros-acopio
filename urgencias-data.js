/**
 * URGENCIAS-DATA.JS — NECESIDADES URGENTES (Dashboard)
 * ================================================================
 * Se llena por un Google Form: qué se necesita, contacto/quién lo
 * necesita, ciudad y categoría. El dashboard de la primera página
 * muestra los últimos 20. La página urgencias.html muestra todo,
 * filtrable por categoría.
 *
 * El correo de quien llena el formulario se recopila en la hoja,
 * pero el código NUNCA lo lee ni lo muestra.
 * ================================================================
 */

// CSV publicado de la hoja de respuestas.
const URGENCIAS_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQotvI4yA968UneBAtHtuZhQ-HDXyL4Jus_bMz0OwLIDiKIQud31SswU7ioEQu0hHttS2O5iUbRnpse/pub?output=csv";

// Google Form para que la gente reporte una necesidad urgente.
const URGENCIAS_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdKXkexe-Skoh1hV_MY-j0E5m4WEoJ3isd1McIsr2dbfFqq6A/viewform";
