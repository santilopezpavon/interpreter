import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import { readDirectory } from './actions.js';
import clipboard from 'clipboardy';

export async function analyzeDirectory() {
  const rl = readline.createInterface({ input, output });

  try {
    const dir = await rl.question('Directorio a analizar: ');
    const role = await rl.question('Rol del análisis (ej: experto en arquitectura): ');
    let requisitos = await rl.question('Requisitos: ');
    if(requisitos != '') {
      requisitos = ". Los requisitos son: " + requisitos;
    } 
    await fs.access(dir).catch(() => {
      throw new Error('El directorio no existe');
    });

    const preprompt = `Como ${role} ${requisitos}  .Analiza el siguiente código:`;
    await readDirectory(dir, preprompt);

    console.log('\n Análisis generado y copiado al portapapeles\n');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    rl.close();
  }
}

export async function apllyChanges() {
    const rl = readline.createInterface({ input, output });
    
  try {
    const dir = await rl.question('Directorio para el RPC: ');
    const preprompt =
      `Dado en analisis que has realizado quiero que me apliques los cambios necesarios ` +
      `La respuesta debe ser únicamente JSON-RPC con las acciones a realizar en el sistema de ficheros en el directorio ${dir}.`;
      `Las acciones posibles son fsWrite, fsDelete`;

    await clipboard.write(preprompt);
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    rl.close();
  }

}