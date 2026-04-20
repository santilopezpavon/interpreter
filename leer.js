import say from 'say';

const text = process.argv.slice(2).join(' ') || 'Hola, este es un ejemplo de lectura en Node.js';

say.speak(text, undefined, 1.0, (err) => {
  if (err) console.error('Error al leer:', err);
});
