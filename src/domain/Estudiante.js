import { ErrorDeDominio } from './errores.js';

/** Entidad Estudiante. Valida sus propios datos al crearse (en el original esto era el if de la linea 7). */
export class Estudiante {
  constructor({ nombre, correo = '', aprobados = [], becado = false } = {}) {
    if (typeof nombre !== 'string' || nombre.trim().length < 3) {
      throw new ErrorDeDominio('ESTUDIANTE_INVALIDO', 'El estudiante debe tener un nombre de al menos 3 letras.', 'validacion');
    }
    if (!Array.isArray(aprobados) || aprobados.some((a) => typeof a !== 'string')) {
      throw new ErrorDeDominio('ESTUDIANTE_INVALIDO', 'Los cursos aprobados deben ser una lista de codigos.', 'validacion');
    }
    this.nombre = nombre.trim();
    this.correo = String(correo);
    this.aprobados = [...aprobados];
    this.becado = becado === true;
  }

  haAprobado(codigoCurso) {
    return this.aprobados.includes(codigoCurso);
  }
}
