import test from 'node:test';
import assert from 'node:assert/strict';
import { crearAplicacion } from '../src/composition.js';
import { crearServidor } from '../src/adapters/in/http/servidor.js';

async function conServidor(fn) {
  const app = crearAplicacion({ mensajeria: { enviar: async () => {} } });
  const servidor = crearServidor(app);
  await new Promise((r) => servidor.listen(0, r));
  const base = `http://localhost:${servidor.address().port}`;
  const pedir = async (ruta, { metodo = 'GET', cuerpo } = {}) => {
    const resp = await fetch(base + ruta, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo === undefined ? undefined : typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
    });
    return { estado: resp.status, datos: await resp.json() };
  };
  try { await fn(pedir, base); } finally { servidor.close(); }
}

const ana = { nombre: 'Ana Perez', correo: 'ana@correo.co', aprobados: [], becado: false };

test('POST /inscripciones crea (201), GET consulta y lista', () => conServidor(async (pedir) => {
  const c = await pedir('/inscripciones', { metodo: 'POST', cuerpo: { estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'presencial' } });
  assert.equal(c.estado, 201);
  assert.equal(c.datos.valor, 200000);
  assert.equal((await pedir('/inscripciones/1')).datos.curso, 'ARQ1');
  assert.equal((await pedir('/inscripciones')).datos.length, 1);
  assert.equal((await pedir('/cursos')).datos.length, 2);
}));

test('POST /inscripciones/:id/retirar retira (200) y la segunda vez da 409', () => conServidor(async (pedir) => {
  await pedir('/inscripciones', { metodo: 'POST', cuerpo: { estudiante: ana, codigoCurso: 'ARQ1', modalidad: 'virtual' } });
  const r = await pedir('/inscripciones/1/retirar', { metodo: 'POST', cuerpo: {} });
  assert.equal(r.datos.estado, 'retirada');
  const otra = await pedir('/inscripciones/1/retirar', { metodo: 'POST', cuerpo: {} });
  assert.equal(otra.estado, 409);
  assert.equal(otra.datos.codigo, 'INSCRIPCION_YA_RETIRADA');
}));

test('errores de negocio: 409 sin cupo, 404 inexistente, 400 invalido', () => conServidor(async (pedir) => {
  const ins = (nombre) => pedir('/inscripciones', { metodo: 'POST', cuerpo: { estudiante: { ...ana, nombre }, codigoCurso: 'ARQ1', modalidad: 'virtual' } });
  await ins('Ana Perez'); await ins('Beto Gomez');
  const sinCupo = await ins('Carla Ruiz');
  assert.equal(sinCupo.estado, 409);
  assert.equal(sinCupo.datos.codigo, 'SIN_CUPO');
  assert.equal((await pedir('/inscripciones/99')).estado, 404);
  const mala = await pedir('/inscripciones', { metodo: 'POST', cuerpo: { estudiante: { ...ana, aprobados: ['ARQ1'] }, codigoCurso: 'ARQ2', modalidad: 'nocturna' } });
  assert.equal(mala.estado, 400);
  assert.equal(mala.datos.codigo, 'MODALIDAD_INVALIDA');
  const json = await pedir('/inscripciones', { metodo: 'POST', cuerpo: '{no es json' });
  assert.equal(json.estado, 400);
  assert.equal((await pedir('/nada')).estado, 404);
}));

test('GET / sirve la pagina y /informe-ia devuelve ARQ-AMB-C', () => conServidor(async (pedir, base) => {
  const html = await (await fetch(base + '/')).text();
  assert.match(html, /Inscripcion a cursos/);
  const r = await pedir('/informe-ia');
  assert.equal(r.datos.codigo, 'ARQ-AMB-C');
}));
