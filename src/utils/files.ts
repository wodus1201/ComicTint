export const APP_DIR = 'comic-tint';
export const PDF_DIR = 'pdfs';

export function buildPdfRelativePath(id: string, safeFileName: string) {
  return `${APP_DIR}/${PDF_DIR}/${id}/${safeFileName}`;
}

export function toSafeFileName(name: string) {
  const trimmed = name.trim();
  const replaced = trimmed.replace(/[^A-Za-z0-9._-]+/g, '_');
  return replaced.length > 0 ? replaced : 'document.pdf';
}

export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

