import { EstrategiaDeModalidad } from './EstrategiaDeModalidad.js';

/** EXTENSION (Parte 2): nueva modalidad "hibrida" = $175.000. Es una Concrete Strategy mas. */
export class ModalidadHibrida extends EstrategiaDeModalidad {
  get modalidad() {
    return 'hibrida';
  }

  valorBase() {
    return 175000;
  }
}
