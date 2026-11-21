import { ErrorDeDominio } from '../../domain/errores.js';
import { inscripcionRetirada } from '../eventos/eventos.js';

/** Caso de uso: RETIRAR una inscripcion. Al hacerlo libera el cupo (deja de contar como activa). */
export class RetirarInscripcion {
  constructor({ cursos, inscripciones, publicador }) {
    this.cursos = cursos;
    this.inscripciones = inscripciones;
    this.publicador = publicador;
  }

  async ejecutar({ id }) {
    const inscripcion = await this.inscripciones.buscarPorId(id);
    if (!inscripcion) {
      throw new ErrorDeDominio('INSCRIPCION_NO_ENCONTRADA', `No existe la inscripcion ${id}.`, 'no_encontrado');
    }
    inscripcion.retirar(); // la entidad decide si se puede
    await this.inscripciones.guardar(inscripcion);

    const curso = await this.cursos.buscarPorCodigo(inscripcion.curso);
    await this.publicador.publicar(
      inscripcionRetirada({
        inscripcionId: inscripcion.id,
        estudiante: { nombre: inscripcion.estudiante, correo: inscripcion.correo },
        curso: curso ?? { codigo: inscripcion.curso, nombre: inscripcion.curso },
      }),
    );
    return inscripcion;
  }
}
