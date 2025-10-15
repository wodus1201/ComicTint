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
  contentUri: string;
}): Promise<{ destPath: string; size: number }>
{
  const rel = buildPdfRelativePath(params.id, params.safeFileName);
  const base = RNBlobUtil.fs.dirs.DocumentDir;
  const destPath = base + '/' + rel;

  const appDir = base + '/' + APP_DIR;
  const pdfDir = appDir + '/' + PDF_DIR;
  const idDir = pdfDir + '/' + params.id;
  
  try {
    await ensureDir(appDir);
    await ensureDir(pdfDir);
    await ensureDir(idDir);
  } catch (error) {
    throw new Error(`디렉토리 생성 실패: ${error}`);
  }

  try {
    await RNBlobUtil.fs.cp(params.contentUri, destPath);
  } catch (error) {
    console.warn('copyContentUriToDocumentDir failed, trying stream method:', error);
    
    try {
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
    } catch (streamError) {
      throw new Error(`파일 복사 실패: ${streamError}`);
    }
  }

  try {
    const stat = await RNBlobUtil.fs.stat(destPath);
    const size = Number(stat.size || 0);
    
    if (size === 0) {
      throw new Error('복사된 파일이 비어있습니다');
    }
    
    return { destPath: 'file://' + destPath, size };
  } catch (error) {
    throw new Error(`파일 크기 확인 실패: ${error}`);
  }
}

export async function deletePdfFile(filePath: string): Promise<void> {
  try {
    const cleanPath = filePath.replace('file://', '');
    const exists = await RNBlobUtil.fs.exists(cleanPath);
    if (exists) {
      await RNBlobUtil.fs.unlink(cleanPath);
    }
  } catch (error) {
    console.warn('deletePdfFile error:', error);
    throw error;
  }
}

export async function deletePdfDirectory(id: string): Promise<void> {
  try {
    const base = RNBlobUtil.fs.dirs.DocumentDir;
    const pdfDir = base + '/' + APP_DIR + '/' + PDF_DIR + '/' + id;
    const exists = await RNBlobUtil.fs.exists(pdfDir);
    if (exists) {
      await RNBlobUtil.fs.unlink(pdfDir);
    }
  } catch (error) {
    console.warn('deletePdfDirectory error:', error);
    throw error;
  }
}
