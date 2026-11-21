/**
 * PUERTO DE SALIDA para enviar avisos. La aplicacion solo conoce esta interfaz;
 * quien de verdad envia (consola, correo, SMS...) es un adaptador en src/adapters/out/.
 */
export class Mensajeria {
  /** @param {{canal: string, destinatario: string, mensaje: string}} aviso */
  async enviar(_aviso) {
    throw new Error('Mensajeria.enviar no implementado');
  }
}
