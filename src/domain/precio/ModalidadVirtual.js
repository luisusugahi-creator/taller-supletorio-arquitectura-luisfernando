import { EstrategiaDeModalidad } from './EstrategiaDeModalidad.js';

/** STRATEGY - rol: "Concrete Strategy". Regla del negocio: virtual = $150.000. */
export class ModalidadVirtual extends EstrategiaDeModalidad {
  get modalidad() {
    return 'virtual';
  }

  valorBase() {
    return 150000;
  }
}
