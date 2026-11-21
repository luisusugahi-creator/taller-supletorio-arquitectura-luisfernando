import test from 'node:test';
import assert from 'node:assert/strict';
import { crearAplicacion } from '../src/composition.js';
import { ErrorDeDominio } from '../src/domain/errores.js';

const nueva = () => {
  const enviados = [];
  const app = crearAplicacion({ mensajeria: { enviar: async (a) => void enviados.push(a) } });
  return { app, enviados, uc: app.casosDeUso };
};
const ana = { nombre: 'Ana Perez', correo: 'ana@correo.co', aprobados: [], becado: false };
const codigo = (c) => (e) => e instanceof ErrorDeDominio && e.codigo === c;

test('crear: inscribe, calcula el valor y avisa al estudiante y a coordinacion', async () => {
  const { uc, enviados } = nueva();
  const i = await uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'presencial' });
  assert.equal(i.id, 1);
  assert.equal(i.valor, 200000);
  assert.equal(i.estado, 'activa');
  assert.deepEqual(enviados.map((a) => a.destinatario), ['ana@correo.co', 'coordinacion']);
});

test('crear: el becado en virtual paga $45.000', async () => {
  const { uc } = nueva();
  const i = await uc.inscribir.ejecutar({ estudiante: { ...ana, becado: true }, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  assert.equal(i.valor, 45000);
});

test('regla principal: sin cupo da SIN_CUPO (ARQ1 tiene cupo 2)', async () => {
  const { uc } = nueva();
  await uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  await uc.inscribir.ejecutar({ estudiante: { ...ana, nombre: 'Beto Gomez' }, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  await assert.rejects(
    uc.inscribir.ejecutar({ estudiante: { ...ana, nombre: 'Carla Ruiz' }, codigoCurso: 'ARQ1', modalidad: 'virtual' }),
    codigo('SIN_CUPO'),
  );
});

test('no se puede inscribir dos veces al mismo curso', async () => {
  const { uc } = nueva();
  await uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' }), codigo('YA_INSCRITO'));
});

test('prerrequisito: ARQ2 exige haber aprobado ARQ1', async () => {
  const { uc } = nueva();
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ2', modalidad: 'virtual' }), codigo('FALTA_PRERREQUISITO'));
  const i = await uc.inscribir.ejecutar({ estudiante: { ...ana, aprobados: ['ARQ1'] }, codigoCurso: 'ARQ2', modalidad: 'virtual' });
  assert.equal(i.curso, 'ARQ2');
});

test('validaciones: estudiante, codigo, curso inexistente y modalidad', async () => {
  const { uc } = nueva();
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: { nombre: 'Al' }, codigoCurso: 'ARQ1', modalidad: 'virtual' }), codigo('ESTUDIANTE_INVALIDO'));
  await assert.rejects(uc.inscribir.ejecutar({ codigoCurso: 'ARQ1', modalidad: 'virtual' }), codigo('ESTUDIANTE_INVALIDO'));
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ', modalidad: 'virtual' }), codigo('CODIGO_INVALIDO'));
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'XXXX', modalidad: 'virtual' }), codigo('CURSO_NO_ENCONTRADO'));
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'nocturna' }), codigo('MODALIDAD_INVALIDA'));
});

test('una inscripcion rechazada no se guarda ni avisa', async () => {
  const { uc, enviados } = nueva();
  await assert.rejects(uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'nocturna' }));
  assert.deepEqual(await uc.listar.ejecutar(), []);
  assert.equal(enviados.length, 0);
});

test('consultar: devuelve la inscripcion o INSCRIPCION_NO_ENCONTRADA', async () => {
  const { uc } = nueva();
  const i = await uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  assert.equal((await uc.consultar.ejecutar({ id: i.id })).estudiante, 'Ana Perez');
  await assert.rejects(uc.consultar.ejecutar({ id: 99 }), codigo('INSCRIPCION_NO_ENCONTRADA'));
});

test('retirar: cambia el estado, avisa, libera el cupo y no se puede repetir', async () => {
  const { uc, enviados } = nueva();
  await uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  await uc.inscribir.ejecutar({ estudiante: { ...ana, nombre: 'Beto Gomez' }, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  enviados.length = 0;
  const r = await uc.retirar.ejecutar({ id: 1 });
  assert.equal(r.estado, 'retirada');
  assert.deepEqual(enviados.map((a) => a.mensaje), ['te retiraste de ARQ1', 'retiro en ARQ1']);
  assert.equal(enviados[0].destinatario, 'ana@correo.co');
  await assert.rejects(uc.retirar.ejecutar({ id: 1 }), codigo('INSCRIPCION_YA_RETIRADA'));
  await assert.rejects(uc.retirar.ejecutar({ id: 99 }), codigo('INSCRIPCION_NO_ENCONTRADA'));
  // cupo liberado: ahora si cabe otro estudiante
  const nuevaIns = await uc.inscribir.ejecutar({ estudiante: { ...ana, nombre: 'Carla Ruiz' }, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  assert.equal(nuevaIns.estado, 'activa');
});

test('listar: con y sin filtros', async () => {
  const { uc } = nueva();
  await uc.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  await uc.inscribir.ejecutar({ estudiante: { ...ana, nombre: 'Beto Gomez', aprobados: ['ARQ1'] }, codigoCurso: 'ARQ2', modalidad: 'virtual' });
  assert.equal((await uc.listar.ejecutar()).length, 2);
  assert.deepEqual((await uc.listar.ejecutar({ curso: 'ARQ2' })).map((i) => i.estudiante), ['Beto Gomez']);
  assert.deepEqual((await uc.listar.ejecutar({ estudiante: 'Ana Perez' })).map((i) => i.curso), ['ARQ1']);
});

test('si falla el correo, la inscripcion igual queda hecha', async () => {
  const errores = [];
  const app = crearAplicacion({
    mensajeria: { enviar: async () => { throw new Error('SMTP caido'); } },
    alFallar: (e) => errores.push(e.message),
  });
  const i = await app.casosDeUso.inscribir.ejecutar({ estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' });
  assert.equal(i.estado, 'activa');
  assert.equal(errores.length, 2);
});
