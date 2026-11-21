import { Estudiante } from '../../domain/Estudiante.js';
import { Curso } from '../../domain/Curso.js';
import { Inscripcion } from '../../domain/Inscripcion.js';
import { ReglasDeInscripcion } from '../../domain/ReglasDeInscripcion.js';
import { ErrorDeDominio } from '../../domain/errores.js';
import { inscripcionCreada } from '../eventos/eventos.js';

/**
 * Caso de uso: CREAR una inscripcion. Orquesta; las reglas viven en el dominio.
 * (Strategy: la calculadora; Observer: el publicador.)
 */
export class InscribirEstudiante {
  constructor({ cursos, inscripciones, calculadora, publicador }) {
    this.cursos = cursos;
    this.inscripciones = inscripciones;
    this.calculadora = calculadora;
    this.publicador = publicador;
  }

  async ejecutar({ estudiante: datosEstudiante, codigoCurso, modalidad }) {
    const estudiante = new Estudiante(datosEstudiante ?? {});
    Curso.validarCodigo(codigoCurso);
    const curso = await this.cursos.buscarPorCodigo(codigoCurso);
    if (!curso) {
      throw new ErrorDeDominio('CURSO_NO_ENCONTRADO', `No existe el curso ${codigoCurso}.`, 'no_encontrado');
    }

    ReglasDeInscripcion.exigirNoInscrito(await this.inscripciones.buscarActiva(estudiante.nombre, codigoCurso));
    ReglasDeInscripcion.exigirCupo(curso, await this.inscripciones.contarActivas(codigoCurso));
    ReglasDeInscripcion.exigirPrerrequisito(curso, estudiante);

    const valor = this.calculadora.calcular({ modalidad, estudiante });
    const inscripcion = await this.inscripciones.guardar(
      new Inscripcion({ estudiante: estudiante.nombre, correo: estudiante.correo, curso: codigoCurso, valor }),
    );

    await this.publicador.publicar(
      inscripcionCreada({ inscripcionId: inscripcion.id, estudiante, curso, valor }),
    );
    return inscripcion;
  }
}
