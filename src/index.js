import { crearAplicacion } from './composition.js';
import { crearServidor } from './adapters/in/http/servidor.js';

const puerto = Number(process.env.PORT) || 3000;
const app = crearAplicacion();
crearServidor(app).listen(puerto, () => {
  console.log(`Servidor listo en http://localhost:${puerto}`);
});
