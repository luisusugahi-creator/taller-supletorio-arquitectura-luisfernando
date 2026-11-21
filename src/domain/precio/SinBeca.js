import { EstrategiaDeBeca } from './EstrategiaDeBeca.js';

/** STRATEGY - rol: "Concrete Strategy". Quien no tiene beca paga el valor completo. */
export class SinBeca extends EstrategiaDeBeca {
  aplicaA() {
    return true; // es la estrategia por defecto: va al final de la lista
  }

  aplicar(valor) {
    return valor;
  }
}
