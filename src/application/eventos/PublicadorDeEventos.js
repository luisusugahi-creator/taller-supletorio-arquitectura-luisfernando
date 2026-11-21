/**
 * OBSERVER (refactoring.guru) - rol: "Publisher".
 * Guarda la lista de suscriptores y los avisa a todos cuando se publica un evento.
 * No sabe quienes son ni que hacen: el caso de uso tampoco, solo publica.
 */
export class PublicadorDeEventos {
  #suscriptores = new Set();
  #alFallar;

  /** @param alFallar funcion (error, suscriptor, evento) para registrar un fallo sin romper a los demas */
  constructor({ alFallar = () => {} } = {}) {
    this.#alFallar = alFallar;
  }

  /** Suscribe y devuelve una funcion para cancelar la suscripcion. */
  suscribir(suscriptor) {
    if (typeof suscriptor?.actualizar !== 'function') {
      throw new TypeError('Un suscriptor debe implementar actualizar(evento)');
    }
    this.#suscriptores.add(suscriptor);
    return () => this.#suscriptores.delete(suscriptor);
  }

  async publicar(evento) {
    // Se recorre una copia: si alguien se desuscribe durante el aviso no se rompe el ciclo.
    const copia = [...this.#suscriptores];
    await Promise.all(
      copia.map(async (suscriptor) => {
        try {
          await suscriptor.actualizar(evento);
        } catch (error) {
          // Un aviso que falla (por ejemplo, el correo) NO debe deshacer una inscripcion ya hecha.
          this.#alFallar(error, suscriptor, evento);
        }
      }),
    );
  }
}
