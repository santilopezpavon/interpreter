import fs from 'node:fs/promises';
import path from 'node:path';
import clipboard from 'clipboardy';

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

        // Dispatcher de métodos
        switch (method) {
          case "fs.read":
            result = await fs.readFile(filePath, "utf8");
            break;

          case "fs.write":
            await fs.writeFile(filePath, params.content, "utf8");
            result = true;
            break;

          case "fs.delete":
            await fs.unlink(filePath);
            result = true;
            break;

          case "fs.list":
            result = await fs.readdir(filePath);
            break;

          default:
            throw new Error(`Unknown method: ${method}`);
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
    console.log("✔️ Response copied to clipboard");

  } catch (err) {
    console.error("❌ Fatal error:", err.message);
  }
}
