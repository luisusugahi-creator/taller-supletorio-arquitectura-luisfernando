/** Caso de uso: listar los cursos (para la pagina). */
export class ListarCursos {
  constructor({ cursos }) {
    this.cursos = cursos;
  }

  async ejecutar() {
    return this.cursos.listar();
  }
}
