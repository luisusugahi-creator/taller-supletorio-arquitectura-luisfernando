/** PUERTO DE SALIDA: donde se guardan las inscripciones. Cambiar de memoria a base de datos = otro adaptador. */
export class RepositorioDeInscripciones {
  async guardar(_inscripcion) { throw new Error('no implementado'); } // asigna id si no tiene
  async buscarPorId(_id) { throw new Error('no implementado'); }
  async buscarActiva(_nombreEstudiante, _codigoCurso) { throw new Error('no implementado'); }
  async contarActivas(_codigoCurso) { throw new Error('no implementado'); }
  async listar(_filtros) { throw new Error('no implementado'); } // { estudiante?, curso?, estado? }
}
