import { createModuleFolder } from './folder';
import { join } from 'path';
import {
  createWriteStream,
  exists,
  rmdir,
  createReadStream,
  copyFile,
} from 'fs';
import { spawn } from 'child_process';

export interface ILatexOptions {
  format?: string;
  command?: string;
}

export default async (doc: string, options: ILatexOptions) => {
  options = options || {};

  const outputFormat = options.format || 'pdf';
  const latexCommand =
    options.command || (outputFormat === 'pdf' ? 'pdflatex' : 'latex');

  try {
    const folderPath = await createModuleFolder();
    const tempFilePath = join(folderPath, 'temp.tex');
    const tempFile = createWriteStream(tempFilePath);

    tempFile.on('open', () => {
      if (typeof doc === 'string') {
        tempFile.end(doc);
      }
    });
    tempFile.on('close', () => {
      //Invoke LaTeX
      const tex = spawn(
        latexCommand,
        ['-interaction=nonstopmode', 'temp.tex'],
        {
          cwd: folderPath,
          env: process.env,
          stdio: ['ignore', 'ignore', 'ignore'],
        }
      );

      tex.stdin.on('data', err => {
        console.log(err);
      });

      tex.stderr.on('data', err => {
        console.log(err);
      });

      //Wait for LaTeX to finish its thing
      tex.on('exit', (code, signal) => {
        if (code !== 0) {
          console.log(`latex process exited with code ${code}`);
          return;
        } else {
          const outputFile = join(folderPath, `temp.${outputFormat}`);
          exists(outputFile, exists => {
            if (exists) {
              const stream = createReadStream(outputFile);
              copyFile(
                outputFile,
                'C:\\Users\\denismaster\\desktop\\result.pdf',
                err => {}
              );
              // stream.pipe(result);
            } else {
            }
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};
