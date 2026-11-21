import { ErrorDeDominio } from './errores.js';

export const ACTIVA = 'activa';
export const RETIRADA = 'retirada';

/** Entidad Inscripcion: guarda sus datos y sabe retirarse (cohesion). */
export class Inscripcion {
  constructor({ id = null, estudiante, correo = '', curso, valor, estado = ACTIVA }) {
    this.id = id;
    this.estudiante = estudiante; // nombre del estudiante (misma llave que usaba el original)
    this.correo = correo; // para avisarle al estudiante si se retira
    this.curso = curso; // codigo del curso
    this.valor = valor;
    this.estado = estado;
  }

  get activa() {
    return this.estado === ACTIVA;
  }

  retirar() {
    if (!this.activa) {
      throw new ErrorDeDominio('INSCRIPCION_YA_RETIRADA', 'Esa inscripcion ya estaba retirada.');
    }
    this.estado = RETIRADA;
  }

  toJSON() {
    return { id: this.id, estudiante: this.estudiante, curso: this.curso, valor: this.valor, estado: this.estado };
  }
}
