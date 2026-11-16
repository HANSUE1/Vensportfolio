const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escape text, then turn **phrase** into an emphasized span. */
export const rich = (s: string) => escape(s).replace(/\*\*(.+?)\*\*/g, '<span class="em">$1</span>');

/** Strip ** markers for plain-text contexts (meta descriptions). */
export const plain = (s: string) => s.replace(/\*\*/g, '');
