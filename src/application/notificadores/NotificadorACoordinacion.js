import { Suscriptor } from '../eventos/Suscriptor.js';
import { INSCRIPCION_CREADA, INSCRIPCION_RETIRADA } from '../eventos/eventos.js';

/** OBSERVER - rol: "Concrete Subscriber". Le avisa a coordinacion. */
export class NotificadorACoordinacion extends Suscriptor {
  #mensajeria;

  constructor(mensajeria) {
    super();
    this.#mensajeria = mensajeria;
  }

  async actualizar(evento) {
    if (evento.tipo === INSCRIPCION_CREADA) {
      await this.#mensajeria.enviar({
        canal: 'EMAIL',
        destinatario: 'coordinacion',
        mensaje: `nuevo inscrito en ${evento.curso.nombre}`,
      });
    } else if (evento.tipo === INSCRIPCION_RETIRADA) {
      await this.#mensajeria.enviar({
        canal: 'EMAIL',
        destinatario: 'coordinacion',
        mensaje: `retiro en ${evento.curso.codigo}`,
      });
    }
  }
}
