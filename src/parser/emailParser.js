// Email parsing utilities

/**
 * Parse raw email or Gmail export into structured messages.
 *
 * Supported formats include full RFC822 messages as well as text
 * copied from Gmail where headers start with `From:` and `Date:`.
 *
 * @param {string} raw - Raw email content
 * @returns {Array<{sender:string,text:string,timestamp:string|null,channel:string,language:string}>}
 */
export function parseEmail(raw) {
  const blocks = raw.split(/\n(?=From:\s)/);
  const messages = [];

  for (const block of blocks) {
    const senderMatch = block.match(/^From:\s*(.+)$/m);
    const dateMatch = block.match(/^Date:\s*(.+)$/m);
    const body = block.split(/\r?\n\r?\n/).slice(1).join('\n').trim();
    const ts = dateMatch ? new Date(dateMatch[1].trim()) : null;

    if (senderMatch || body) {
      messages.push({
        sender: senderMatch ? senderMatch[1].trim() : '',
        text: body,
        timestamp: ts && !isNaN(ts) ? ts.toISOString() : null,
        channel: 'email',
        language: 'unknown',
      });
    }
  }

  return messages;
}
