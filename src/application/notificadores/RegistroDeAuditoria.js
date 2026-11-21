import { Suscriptor } from '../eventos/Suscriptor.js';

/**
 * EXTENSION (Parte 2): nuevo Concrete Subscriber que deja un registro de auditoria
 * de cada inscripcion creada o retirada. Recibe la funcion `registrar` (por defecto, consola)
 * para no depender de nada concreto.
 */
export class RegistroDeAuditoria extends Suscriptor {
  #registrar;
  #registros = [];

  constructor(registrar = (linea) => console.log(linea)) {
    super();
    this.#registrar = registrar;
  }

  get registros() {
    return [...this.#registros];
  }

  async actualizar(evento) {
    const linea = `AUDITORIA ${evento.tipo} inscripcion=${evento.inscripcionId} estudiante="${evento.estudiante.nombre}" curso=${evento.curso.codigo}`;
    this.#registros.push(linea);
    this.#registrar(linea);
  }
}
