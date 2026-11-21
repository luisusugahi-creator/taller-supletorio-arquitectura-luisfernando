import { RepositorioDeCursos } from '../../application/puertos/RepositorioDeCursos.js';
import { Curso } from '../../domain/Curso.js';

/** ADAPTADOR DE SALIDA: cursos en memoria. Mismos datos que el original. */
export class CursosEnMemoria extends RepositorioDeCursos {
  #cursos;

  constructor(cursos = [
    new Curso({ codigo: 'ARQ1', nombre: 'Arquitectura I', cupo: 2, prerrequisito: null }),
    new Curso({ codigo: 'ARQ2', nombre: 'Arquitectura II', cupo: 25, prerrequisito: 'ARQ1' }),
  ]) {
    super();
    this.#cursos = new Map(cursos.map((c) => [c.codigo, c]));
  }

  async buscarPorCodigo(codigo) {
    return this.#cursos.get(codigo) ?? null;
  }

  async listar() {
    return [...this.#cursos.values()];
  }
}
