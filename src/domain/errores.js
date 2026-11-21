/**
 * Error de las reglas del negocio. En vez de hacer console.log + return (como el original),
 * el dominio lanza este error con un codigo estable y un mensaje claro. Quien llama decide
 * que hacer con el (el adaptador HTTP lo traduce a 400, 404 o 409).
 *
 * tipo: 'validacion' (dato mal escrito), 'no_encontrado' (no existe) o 'conflicto' (rompe una regla).
 */
export class ErrorDeDominio extends Error {
  constructor(codigo, mensaje, tipo = 'conflicto') {
    super(mensaje);
    this.name = 'ErrorDeDominio';
    this.codigo = codigo;
    this.tipo = tipo;
  }
}
