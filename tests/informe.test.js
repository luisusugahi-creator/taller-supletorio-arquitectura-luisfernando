import test from 'node:test';
import assert from 'node:assert/strict';
import { informeUsoIA } from '../src/domain/informeUsoIA.js';

test('informeUsoIA declara herramienta, porcentaje y el codigo ARQ-AMB-C', () => {
  const r = informeUsoIA();
  assert.equal(r.codigo, 'ARQ-AMB-C');
  assert.ok(r.herramienta.length > 0);
  assert.ok(r.porcentajeCodigoGeneradoPorIA >= 0 && r.porcentajeCodigoGeneradoPorIA <= 100);
});
