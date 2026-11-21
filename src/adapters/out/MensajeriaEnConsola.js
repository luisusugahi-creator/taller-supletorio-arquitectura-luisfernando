import { Mensajeria } from '../../application/puertos/Mensajeria.js';

/** ADAPTADOR DE SALIDA: "envia" los avisos escribiendolos en consola (igual que el original). */
export class MensajeriaEnConsola extends Mensajeria {
  async enviar({ canal, destinatario, mensaje }) {
    console.log(`${canal} a ${destinatario}: ${mensaje}`);
  }
}
