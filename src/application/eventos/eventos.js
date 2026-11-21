/** Eventos que el caso de uso publica cuando algo importante ocurre. Son datos inmutables. */
export const INSCRIPCION_CREADA = 'INSCRIPCION_CREADA';
export const INSCRIPCION_RETIRADA = 'INSCRIPCION_RETIRADA';

export const inscripcionCreada = ({ inscripcionId, estudiante, curso, valor }) =>
  Object.freeze({
    tipo: INSCRIPCION_CREADA,
    inscripcionId,
    estudiante: Object.freeze({ nombre: estudiante.nombre, correo: estudiante.correo }),
    curso: Object.freeze({ codigo: curso.codigo, nombre: curso.nombre }),
    valor,
  });

export const inscripcionRetirada = ({ inscripcionId, estudiante, curso }) =>
  Object.freeze({
    tipo: INSCRIPCION_RETIRADA,
    inscripcionId,
    estudiante: Object.freeze({ nombre: estudiante.nombre, correo: estudiante.correo }),
    curso: Object.freeze({ codigo: curso.codigo, nombre: curso.nombre }),
  });
