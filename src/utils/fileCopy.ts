import RNBlobUtil from 'react-native-blob-util';
import { buildPdfRelativePath, APP_DIR, PDF_DIR } from './files';

async function ensureDir(path: string) {
  const isDir = await RNBlobUtil.fs.isDir(path);
  if (!isDir) {
    await RNBlobUtil.fs.mkdir(path);
  }
}

export async function copyContentUriToDocumentDir(params: {
  id: string;
  safeFileName: string;
  contentUri: string; // content://
}): Promise<{ destPath: string; size: number }>
{
  const rel = buildPdfRelativePath(params.id, params.safeFileName);
  const base = RNBlobUtil.fs.dirs.DocumentDir;
  const destPath = base + '/' + rel;

  const appDir = base + '/' + APP_DIR;
  const pdfDir = appDir + '/' + PDF_DIR;
  const idDir = pdfDir + '/' + params.id;
  await ensureDir(appDir);
  await ensureDir(pdfDir);
  await ensureDir(idDir);

  // Simple approach: use RNBlobUtil's built-in copy for content URIs
  try {
    await RNBlobUtil.fs.cp(params.contentUri, destPath);
  } catch (error) {
    console.warn('Direct copy failed, trying stream method:', error);
    
    // Fallback to stream method
    const stream = await RNBlobUtil.fs.readStream(params.contentUri, 'base64');
    const chunks: string[] = [];
    
    stream.open();
    stream.onData((chunk: string | number[]) => {
      if (typeof chunk === 'string') {
        chunks.push(chunk);
      }
    });
    
    await new Promise<void>((resolve, reject) => {
      stream.onEnd(() => {
        resolve();
      });
      stream.onError((err: any) => {
        reject(err);
      });
    });
    
    const base64 = chunks.join('');
    await RNBlobUtil.fs.writeFile(destPath, base64, 'base64');
  }

  const stat = await RNBlobUtil.fs.stat(destPath);
  const size = Number(stat.size || 0);
  return { destPath: 'file://' + destPath, size };
}
