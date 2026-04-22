import fs from 'node:fs/promises';
import path from 'node:path';
import clipboard from 'clipboardy';


/**
 * Carga las reglas de exclusión exclusivamente desde .interpreterignore
 */
async function getIgnoreRules(dirPath) {
    // const ignorePath = path.join(dirPath, '.interpreterignore');
    const ignorePath = '.interpreterignore';
    try {
        const content = await fs.readFile(ignorePath, 'utf8');
        return content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')); // Filtra líneas vacías y comentarios
    } catch (e) {
        // Si el archivo no existe, no ignora nada (lista vacía)
        return [];
    }
}

/**
 * Lee el directorio, aplica filtros del archivo ignore y copia al portapapeles.
 */
export async function readDirectory(dirPath, preprompt = '') {
    try {
        const absolutePath = path.resolve(dirPath);
        if (!(await fs.stat(absolutePath)).isDirectory()) return;

        // Carga reglas dinámicas
        const ignoreRules = await getIgnoreRules(absolutePath);
        console.log(`\n Reading: ${absolutePath}`);
        if (ignoreRules.length > 0) {
            console.log(`Custom Ignore Rules active.`);
        }
        
        let res = await scanDir(absolutePath, "", ignoreRules, absolutePath);
        res = preprompt + " " + res.trim();
        await clipboard.write(res);
        console.log(`\n Copiado al portapapeles: ${res.length} caracteres.`);
        
    } catch (e) {
        console.error(' Error:', e.message);
    }
}

/**
 * Escaneo recursivo con optimización de caracteres.
 */
async function scanDir(curr, acc, ignoreRules, rootPath) {
    const entries = await fs.readdir(curr, { withFileTypes: true });

    for (const entry of entries) {
        // Comprobar si el archivo/carpeta está en la lista de ignorados
        if (ignoreRules.includes(entry.name)) continue;

        const full = path.join(curr, entry.name);
        const relative = path.relative(rootPath, full);

        if (entry.isDirectory()) {
            acc = await scanDir(full, acc, ignoreRules, rootPath);
        } else if (entry.isFile()) {
            try {
                let c = await fs.readFile(full, 'utf8');
                
                // Compresión: quita comentarios, une espacios y saltos de línea
                c = c
                    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') 
                    .replace(/\s+/g, ' ')
                    .trim();

                // Formato ultra-compacto [ruta]:contenido
                acc += `[${relative}]:${c}\n`; 
            } catch (e) {
                // Error silencioso para archivos que no se pueden leer (ej. binarios)
            }
        }
    }
    return acc;
}