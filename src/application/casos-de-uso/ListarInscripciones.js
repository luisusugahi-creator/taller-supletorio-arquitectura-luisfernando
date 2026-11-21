/** Caso de uso: LISTAR inscripciones, con filtros opcionales por estudiante, curso o estado. */
export class ListarInscripciones {
  constructor({ inscripciones }) {
    this.inscripciones = inscripciones;
  }

  async ejecutar(filtros = {}) {
    return this.inscripciones.listar(filtros);
  }
}
