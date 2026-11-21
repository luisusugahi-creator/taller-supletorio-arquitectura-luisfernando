import { ErrorDeDominio } from './errores.js';

/** Entidad Curso: codigo de 4 caracteres, cupo y prerrequisito opcional. */
export class Curso {
  constructor({ codigo, nombre, cupo, prerrequisito = null }) {
    Curso.validarCodigo(codigo);
    this.codigo = codigo;
    this.nombre = nombre;
    this.cupo = cupo;
    this.prerrequisito = prerrequisito;
  }

  static validarCodigo(codigo) {
    if (typeof codigo !== 'string' || codigo.length !== 4) {
      throw new ErrorDeDominio('CODIGO_INVALIDO', 'El codigo del curso debe tener 4 caracteres.', 'validacion');
    }
  }

  tieneCupo(inscritosActivos) {
    return inscritosActivos < this.cupo;
  }
}
