/**
 * STRATEGY (refactoring.guru) - rol: interfaz "Strategy" para la segunda decision del precio: la beca.
 * - aplicaA(estudiante): ¿esta beca le corresponde a este estudiante?
 * - aplicar(valor): devuelve el valor que de verdad paga.
 */
export class EstrategiaDeBeca {
  aplicaA(_estudiante) {
    throw new Error('EstrategiaDeBeca.aplicaA no implementado');
  }

  aplicar(_valor) {
    throw new Error('EstrategiaDeBeca.aplicar no implementado');
  }
}
