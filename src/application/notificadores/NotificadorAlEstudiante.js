import { Suscriptor } from '../eventos/Suscriptor.js';
import { INSCRIPCION_CREADA, INSCRIPCION_RETIRADA } from '../eventos/eventos.js';

/** OBSERVER - rol: "Concrete Subscriber". Le avisa por correo al estudiante. */
export class NotificadorAlEstudiante extends Suscriptor {
  #mensajeria;

  constructor(mensajeria) {
    super();
    this.#mensajeria = mensajeria;
  }

  async actualizar(evento) {
    const destinatario = evento.estudiante.correo;
    if (evento.tipo === INSCRIPCION_CREADA) {
      await this.#mensajeria.enviar({
        canal: 'EMAIL',
        destinatario,
        mensaje: `quedaste inscrito en ${evento.curso.nombre}. Valor $${evento.valor}`,
      });
    } else if (evento.tipo === INSCRIPCION_RETIRADA) {
      await this.#mensajeria.enviar({
        canal: 'EMAIL',
        destinatario,
        mensaje: `te retiraste de ${evento.curso.codigo}`,
      });
    }
  }
}
