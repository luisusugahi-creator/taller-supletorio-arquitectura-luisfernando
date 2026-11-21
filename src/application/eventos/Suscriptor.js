/**
 * OBSERVER (refactoring.guru) - rol: interfaz "Subscriber".
 * Todo el que quiera enterarse de lo que pasa solo tiene que implementar actualizar(evento).
 */
export class Suscriptor {
  async actualizar(_evento) {
    throw new Error('Suscriptor.actualizar no implementado');
  }
}
