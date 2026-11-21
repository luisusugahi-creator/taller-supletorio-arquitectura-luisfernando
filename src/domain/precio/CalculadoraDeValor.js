import { ErrorDeDominio } from '../errores.js';

/**
 * STRATEGY (refactoring.guru) - rol: "Context".
 * No tiene ni un if por modalidad ni por beca: guarda las estrategias que le entregan y delega.
 * Si manana aparece otra modalidad, esta clase NO cambia (principio abierto/cerrado).
 *
 * @param modalidades lista de EstrategiaDeModalidad
 * @param becas lista de EstrategiaDeBeca, en orden de prioridad (la primera que aplique gana)
 */
export class CalculadoraDeValor {
  #modalidades;
  #becas;

  constructor({ modalidades, becas }) {
    this.#modalidades = new Map(modalidades.map((m) => [m.modalidad, m]));
    this.#becas = becas;
  }

  /** Modalidades aceptadas (sirve para mostrarlas en la pagina y en los mensajes de error). */
  modalidadesDisponibles() {
    return [...this.#modalidades.keys()];
  }

  calcular({ modalidad, estudiante }) {
    const estrategia = this.#modalidades.get(modalidad);
    if (!estrategia) {
      // En el original una modalidad desconocida dejaba el valor en 0 y se inscribia gratis.
      throw new ErrorDeDominio(
        'MODALIDAD_INVALIDA',
        `La modalidad "${modalidad}" no existe. Opciones: ${this.modalidadesDisponibles().join(', ')}.`,
        'validacion',
      );
    }
    const valorBase = estrategia.valorBase();
    const beca = this.#becas.find((b) => b.aplicaA(estudiante));
    return beca ? beca.aplicar(valorBase) : valorBase;
  }
}
