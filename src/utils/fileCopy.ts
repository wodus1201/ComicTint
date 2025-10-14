import RNBlobUtil from 'react-native-blob-util';
import { buildPdfRelativePath } from './files';

export async function copyContentUriToDocumentDir(params: {
  id: string;
  safeFileName: string;
  contentUri: string;
}): Promise<{ destPath: string; size: number }>
{
  const rel = buildPdfRelativePath(params.id, params.safeFileName);
  const destPath = RNBlobUtil.fs.dirs.DocumentDir + '/' + rel;

  const dirPath = destPath.substring(0, destPath.lastIndexOf('/'));
  await RNBlobUtil.fs.mkdir(dirPath);

  if (params.contentUri.startsWith('content://')) {
    const data = await RNBlobUtil.fs.readStream(params.contentUri, 'base64');
    const fetched = await RNBlobUtil.config({
      fileCache: false,
      trusty: true,
    }).fetch('GET', params.contentUri);
    const base64 = await fetched.base64();
    await RNBlobUtil.fs.writeFile(destPath, base64, 'base64');
  } else if (params.contentUri.startsWith('file://')) {
    await RNBlobUtil.fs.cp(params.contentUri.replace('file://', ''), destPath);
  } else {
    await RNBlobUtil.fs.cp(params.contentUri, destPath);
  }

  const stat = await RNBlobUtil.fs.stat(destPath);
  const size = Number(stat.size || 0);
  return { destPath: 'file://' + destPath, size };
}
