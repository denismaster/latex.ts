import { mkdir, track } from 'temp';
import { join } from 'path';

//track();

export function createModuleFolder(): Promise<string | any> {
  return new Promise((resolve, reject) => {
    mkdir('latex.js', (error: any, folderPath: string) => {
      if (error) reject(error);
      resolve(folderPath);
    });
  });
}

export function createTemporaryFolder(
  folderPath: string,
  tempFolderName: string
) {
  const tempPath = join(folderPath, tempFolderName);
}
