export const APP_DIR = 'comic-tint';
export const PDF_DIR = 'pdfs';

export function buildPdfRelativePath(id: string, safeFileName: string) {
  return `${APP_DIR}/${PDF_DIR}/${id}/${safeFileName}`;
}

export function toSafeFileName(name: string) {
  if (!name || typeof name !== 'string') {
    return 'document.pdf';
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return 'document.pdf';
  }

  const replaced = trimmed.replace(/[^A-Za-z0-9._-가-힣\s]+/g, '_');

  const cleaned = replaced.replace(/_+/g, '_');

  const final = cleaned.replace(/^_+|_+$/g, '');
  
  if (final.length === 0) {
    return 'document.pdf';
  }
  
  if (final.length > 100) {
    return final.substring(0, 100) + '.pdf';
  }
  
  if (!final.includes('.')) {
    return final + '.pdf';
  }
  
  return final;
}

export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function stripExtension(name: string) {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (trimmed.length === 0) return '';
  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot <= 0) return trimmed;
  return trimmed.substring(0, lastDot);
}
