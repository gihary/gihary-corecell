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

/**
 * Parse an exported WhatsApp chat text.
 * Each line is expected in the form "DD/MM/YYYY, HH:MM - Sender: message".
 * Lines that don't match this pattern are ignored.
 *
 * @param {string} rawText - Full chat export text
 * @returns {object} Object containing parsed messages and statistics
 */
export function parseWhatsAppChat(rawText) {
  const lines = rawText.split(/\r?\n/);
  const messages = [];
  const participantsSet = new Set();
  const perDay = {};
  const perUser = {};

  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s*(\d{1,2}):(\d{2})\s*-\s*([^:]+):\s*(.*)$/;

  for (const line of lines) {
    const m = line.match(regex);
    if (!m) continue;

    const [ , d, mth, y, h, min, sender, text ] = m;
    const year = y.length === 2 ? `20${y}` : y;
    const dateObj = new Date(Number(year), Number(mth) - 1, Number(d), Number(h), Number(min));
    const iso = dateObj.toISOString();

    messages.push({ sender, message: text, date: iso });
    participantsSet.add(sender);

    const dayKey = iso.split('T')[0];
    perDay[dayKey] = (perDay[dayKey] || 0) + 1;
    perUser[sender] = (perUser[sender] || 0) + 1;
  }

  let mainConversation = null;
  let max = 0;
  for (const [user, count] of Object.entries(perUser)) {
    if (count > max) {
      max = count;
      mainConversation = user;
    }
  }

  return {
    messages,
    participants: Array.from(participantsSet),
    frequencyStats: {
      totalMessages: messages.length,
      perDay,
    },
    mainConversation,
  };
}
