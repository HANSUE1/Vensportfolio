import fs from 'node:fs';
import path from 'node:path';

/** True when a photo exists in public/ at build time, e.g. "work/literacy-tutor.jpg". */
export const hasPublic = (file: string) => fs.existsSync(path.join(process.cwd(), 'public', file));
