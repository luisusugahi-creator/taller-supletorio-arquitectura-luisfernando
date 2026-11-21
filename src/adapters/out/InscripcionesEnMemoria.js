import { RepositorioDeInscripciones } from '../../application/puertos/RepositorioDeInscripciones.js';
import { Inscripcion } from '../../domain/Inscripcion.js';

/** ADAPTADOR DE SALIDA: inscripciones en memoria. Solo guarda y busca; no aplica reglas de negocio. */
export class InscripcionesEnMemoria extends RepositorioDeInscripciones {
  #porId = new Map();
  #siguienteId = 1;

  #copiar(i) {
    return new Inscripcion({ ...i });
  }

  async guardar(inscripcion) {
    if (inscripcion.id === null) inscripcion.id = this.#siguienteId++;
    this.#porId.set(inscripcion.id, this.#copiar(inscripcion));
    return this.#copiar(inscripcion);
  }

  async buscarPorId(id) {
    const i = this.#porId.get(Number(id));
    return i ? this.#copiar(i) : null;
  }

  async buscarActiva(estudiante, curso) {
    for (const i of this.#porId.values()) {
      if (i.estudiante === estudiante && i.curso === curso && i.activa) return this.#copiar(i);
    }
    return null;
  }

  async contarActivas(curso) {
    let n = 0;
    for (const i of this.#porId.values()) if (i.curso === curso && i.activa) n++;
    return n;
  }

  async listar({ estudiante, curso, estado } = {}) {
    return [...this.#porId.values()]
      .filter((i) => (!estudiante || i.estudiante === estudiante) && (!curso || i.curso === curso) && (!estado || i.estado === estado))
      .map((i) => this.#copiar(i));
  }
}
