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
