/**
 * STRATEGY (refactoring.guru) - rol: interfaz "Strategy".
 * Una estrategia de modalidad sabe una sola cosa: cuanto vale el curso en esa modalidad.
 */
export class EstrategiaDeModalidad {
  /** Nombre con el que llega la modalidad ("presencial", "virtual", ...). */
  get modalidad() {
    throw new Error('EstrategiaDeModalidad.modalidad no implementado');
  }

  /** Valor del curso antes de aplicar becas, en pesos. */
  valorBase() {
    throw new Error('EstrategiaDeModalidad.valorBase no implementado');
  }
}
