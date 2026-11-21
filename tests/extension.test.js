import test from 'node:test';
import assert from 'node:assert/strict';
import { crearAplicacion } from '../src/composition.js';

const ana = { nombre: 'Ana Perez', correo: 'ana@correo.co', becado: false };

test('extension: la modalidad hibrida vale $175.000 ($52.500 con beca)', async () => {
  const app = crearAplicacion({ mensajeria: { enviar: async () => {} }, registrarAuditoria: () => {} });
  const a = await app.casosDeUso.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'hibrida' });
  const b = await app.casosDeUso.inscribir.ejecutar({ estudiante: { ...ana, nombre: 'Beto Gomez', becado: true }, codigoCurso: 'ARQ1', modalidad: 'hibrida' });
  assert.equal(a.valor, 175000);
  assert.equal(b.valor, 52500);
});

test('extension: la auditoria registra la creacion y el retiro', async () => {
  const lineas = [];
  const app = crearAplicacion({ mensajeria: { enviar: async () => {} }, registrarAuditoria: (l) => lineas.push(l) });
  const i = await app.casosDeUso.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  await app.casosDeUso.retirar.ejecutar({ id: i.id });
  assert.equal(lineas.length, 2);
  assert.match(lineas[0], /INSCRIPCION_CREADA inscripcion=1 estudiante="Ana Perez" curso=ARQ1/);
  assert.match(lineas[1], /INSCRIPCION_RETIRADA/);
});
