import fs from 'node:fs/promises';
import path from 'node:path';
import clipboard from 'clipboardy';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function runRpc() {
  let request;

  try {
    // Leer JSON o JSON batch del portapapeles
    const raw = await clipboard.read();
    request = JSON.parse(raw);

    const isBatch = Array.isArray(request);
    const requests = isBatch ? request : [request];

    const responses = [];

    for (const req of requests) {
      try {
        if (req.jsonrpc !== "2.0") {
          throw new Error("Invalid JSON-RPC version");
        }

        const { method, params, id } = req;
        let result;

        // Resolver ruta absoluta
        const filePath = params?.path ? path.resolve(params.path) : null;

        // Crear directorios automáticamente si hay path
        if (filePath) {
          const dir = path.dirname(filePath);
          await fs.mkdir(dir, { recursive: true });
        }

        const action = method.toLowerCase();
        let normalizedMethod = "";
        if (action.includes("read"))   normalizedMethod = "read";
        else if (action.includes("write"))  normalizedMethod = "write";
        else if (action.includes("delete")) normalizedMethod = "delete";
        else if (action.includes("update")) normalizedMethod = "update";
        else if (action.includes("list"))   normalizedMethod = "list";



        // Dispatcher de métodos
        switch (normalizedMethod) {
          case "read":
            result = await fs.readFile(filePath, "utf8");
            break;

          case "write":
          case "update":
            await fs.writeFile(filePath, params.content, "utf8");
            result = true;
            break;

          case "delete":
            await fs.unlink(filePath);
            result = true;
            break;

          case "list":
            result = await fs.readdir(filePath);
            break;
            
          default:
            throw new Error(`Método no reconocido: ${method}`);
        }


        // Respuesta correcta
        responses.push({
          jsonrpc: "2.0",
          result,
          id
        });

      } catch (err) {
        // Respuesta de error por request
        responses.push({
          jsonrpc: "2.0",
          error: { code: -32000, message: err.message },
          id: req?.id ?? null
        });
      }
    }

    // Si era batch → array. Si no → objeto.
    const output = isBatch ? responses : responses[0];

    await clipboard.write(JSON.stringify(output, null, 2));
    console.log("Response copied to clipboard");

  } catch (err) {
    console.error("Fatal error:", err.message);
  }
}

export async function callRPC() {
  const rl = readline.createInterface({ input, output });

  try {
    const dir = await rl.question('Directorio del código: ');
    const role = await rl.question('Rol del creador (ej: experto en arquitectura): ');
    let requisitos = await rl.question('Requisitos: ');
    const peticion = await rl.question('Petición: ');
    if(requisitos != '') {
      requisitos = ".Los requisitos son: " + requisitos;
    } 

    const preprompt =
      `Como ${role}. ${peticion} ${requisitos} ` +
      `La respuesta debe ser únicamente JSON-RPC con las acciones a realizar en el sistema de ficheros en el directorio ${dir}.`;
      `Las acciones posibles son fsWrite, fsDelete`;

    await clipboard.write(preprompt);

    console.log('\n Prompt generado y copiado al portapapeles\n');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    rl.close();
  }
}