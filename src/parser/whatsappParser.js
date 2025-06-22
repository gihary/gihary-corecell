// WhatsApp message parsing utilities

/**
 * Parse exported WhatsApp chat text.
 *
 * Typical export lines look like:
 * `12/03/24, 15:22 - Alice: Hello world`
 * `[12/03/24, 15:22:11] Bob: Hi!`
 *
 * The parser returns an array of objects with sender, text,
 * timestamp, channel and language fields.
 *
 * @param {string} raw - Raw WhatsApp export
 * @returns {Array<{sender:string,text:string,timestamp:string|null,channel:string,language:string}>}
 */
export function parseWhatsappMessage(raw) {
  const lines = raw.split(/\r?\n/);
  const messages = [];
  const pattern = /^(?:\[)?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]?\s*(?:-|–)\s*([^:]+):\s*(.*)$/;

  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      const [, date, time, sender, text] = match;
      const dateTime = `${date} ${time}`;
      const ts = new Date(dateTime);
      messages.push({
        sender: sender.trim(),
        text: text.trim(),
        timestamp: isNaN(ts) ? null : ts.toISOString(),
        channel: 'whatsapp',
        language: 'unknown',
      });
    } else if (messages.length > 0) {
      messages[messages.length - 1].text += `\n${line.trim()}`;
    }
  }

  return messages;
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
