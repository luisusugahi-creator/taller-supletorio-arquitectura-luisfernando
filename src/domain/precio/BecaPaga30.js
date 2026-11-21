import { EstrategiaDeBeca } from './EstrategiaDeBeca.js';

/** STRATEGY - rol: "Concrete Strategy". Regla del negocio: el estudiante becado paga el 30 %. */
export class BecaPaga30 extends EstrategiaDeBeca {
  aplicaA(estudiante) {
    return estudiante.becado === true;
  }

  aplicar(valor) {
    // Math.round evita arrastrar decimales de punto flotante (el original hacia valor * 0.3).
    return Math.round((valor * 30) / 100);
  }
}
