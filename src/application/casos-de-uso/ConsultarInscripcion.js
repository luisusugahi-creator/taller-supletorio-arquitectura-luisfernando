import { ErrorDeDominio } from '../../domain/errores.js';

/** Caso de uso: CONSULTAR una inscripcion por su id. */
export class ConsultarInscripcion {
  constructor({ inscripciones }) {
    this.inscripciones = inscripciones;
  }

  async ejecutar({ id }) {
    const inscripcion = await this.inscripciones.buscarPorId(id);
    if (!inscripcion) {
      throw new ErrorDeDominio('INSCRIPCION_NO_ENCONTRADA', `No existe la inscripcion ${id}.`, 'no_encontrado');
    }
    return inscripcion;
  }
}
