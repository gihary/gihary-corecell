// WhatsApp message parsing utilities

/**
 * Parse a WhatsApp message string.
 * @param {string} raw - Raw message text
 * @returns {string} - Parsed message
 */
export function parseWhatsappMessage(raw) {
  // Placeholder: remove timestamps or metadata if any
  return raw.replace(/\[[^\]]*\]/g, '').trim();
}
