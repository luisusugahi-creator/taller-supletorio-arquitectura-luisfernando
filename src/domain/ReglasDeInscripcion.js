import { ErrorDeDominio } from './errores.js';

/**
 * Reglas de negocio de inscribirse, puras (sin base de datos ni HTTP).
 * Regla principal: no se puede inscribir si no hay cupo (SIN_CUPO).
 */
export class ReglasDeInscripcion {
  static exigirNoInscrito(inscripcionActiva) {
    if (inscripcionActiva) {
      throw new ErrorDeDominio('YA_INSCRITO', 'El estudiante ya esta inscrito en ese curso.');
    }
  }

  static exigirCupo(curso, inscritosActivos) {
    if (!curso.tieneCupo(inscritosActivos)) {
      throw new ErrorDeDominio('SIN_CUPO', `El curso ${curso.nombre} no tiene cupo.`);
    }
  }

  static exigirPrerrequisito(curso, estudiante) {
    if (curso.prerrequisito !== null && !estudiante.haAprobado(curso.prerrequisito)) {
      throw new ErrorDeDominio('FALTA_PRERREQUISITO', `Falta aprobar el prerrequisito ${curso.prerrequisito}.`);
    }
  }
}
