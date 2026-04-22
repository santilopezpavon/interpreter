# Interpreter CLI

A lightweight **Node.js command‑line tool** for:

- Capturing user input and saving it to a file  
- Reading and compressing the contents of an entire directory  
- Automatically copying the processed output to the clipboard  
- Respecting custom ignore rules via `.interpreterignore`  
- Cleaning comments and whitespace from files for compact summaries  

Perfect for code inspection, dataset preparation, prompt engineering, or project summarization.

# Usage

npm start creator:
    Crea un prompt en el porta papeles, que es para que el Chat devuelva un JSONRPC.

npm start rpc:
    Coge un JSONRPC del copia papeles y ejecuta las acciones

npm start analyze:
    Genera un prompt con el contenido de código de un directorio para enviar a analizar

npm start analyze-apply:
    Genera un prompt para solicitar la aplicación de las mejoras del analyze en JSONRPC


