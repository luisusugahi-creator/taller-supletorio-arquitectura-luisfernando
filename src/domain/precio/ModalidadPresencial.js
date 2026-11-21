import { EstrategiaDeModalidad } from './EstrategiaDeModalidad.js';

/** STRATEGY - rol: "Concrete Strategy". Regla del negocio: presencial = $200.000. */
export class ModalidadPresencial extends EstrategiaDeModalidad {
  get modalidad() {
    return 'presencial';
  }

  valorBase() {
    return 200000;
  }
}
