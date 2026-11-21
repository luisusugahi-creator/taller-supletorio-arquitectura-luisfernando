import test from 'node:test';
import assert from 'node:assert/strict';
import { CalculadoraDeValor } from '../src/domain/precio/CalculadoraDeValor.js';
import { ModalidadPresencial } from '../src/domain/precio/ModalidadPresencial.js';
import { ModalidadVirtual } from '../src/domain/precio/ModalidadVirtual.js';
import { BecaPaga30 } from '../src/domain/precio/BecaPaga30.js';
import { SinBeca } from '../src/domain/precio/SinBeca.js';
import { ErrorDeDominio } from '../src/domain/errores.js';

const crear = () =>
  new CalculadoraDeValor({
    modalidades: [new ModalidadPresencial(), new ModalidadVirtual()],
    becas: [new BecaPaga30(), new SinBeca()],
  });

test('presencial sin beca vale $200.000', () => {
  assert.equal(crear().calcular({ modalidad: 'presencial', estudiante: { becado: false } }), 200000);
});

test('virtual sin beca vale $150.000', () => {
  assert.equal(crear().calcular({ modalidad: 'virtual', estudiante: { becado: false } }), 150000);
});

test('el becado paga el 30 %: presencial $60.000 y virtual $45.000', () => {
  const calc = crear();
  assert.equal(calc.calcular({ modalidad: 'presencial', estudiante: { becado: true } }), 60000);
  assert.equal(calc.calcular({ modalidad: 'virtual', estudiante: { becado: true } }), 45000);
});

test('una modalidad desconocida se rechaza (el original cobraba $0)', () => {
  assert.throws(
    () => crear().calcular({ modalidad: 'nocturna', estudiante: { becado: false } }),
    (e) => e instanceof ErrorDeDominio && e.codigo === 'MODALIDAD_INVALIDA',
  );
});

test('modalidadesDisponibles lista lo que se registro', () => {
  assert.deepEqual(crear().modalidadesDisponibles(), ['presencial', 'virtual']);
});
