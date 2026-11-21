import test from 'node:test';
import assert from 'node:assert/strict';
import { PublicadorDeEventos } from '../src/application/eventos/PublicadorDeEventos.js';
import { inscripcionCreada, inscripcionRetirada } from '../src/application/eventos/eventos.js';
import { NotificadorAlEstudiante } from '../src/application/notificadores/NotificadorAlEstudiante.js';
import { NotificadorACoordinacion } from '../src/application/notificadores/NotificadorACoordinacion.js';

const datos = {
  inscripcionId: 1,
  estudiante: { nombre: 'Ana Perez', correo: 'ana@correo.co' },
  curso: { codigo: 'ARQ1', nombre: 'Arquitectura I' },
  valor: 45000,
};

const mensajeriaFalsa = () => {
  const enviados = [];
  return { enviados, enviar: async (aviso) => void enviados.push(aviso) };
};

test('el publicador avisa a todos los suscriptores', async () => {
  const recibidos = [];
  const p = new PublicadorDeEventos();
  p.suscribir({ actualizar: (e) => recibidos.push(['a', e.tipo]) });
  p.suscribir({ actualizar: (e) => recibidos.push(['b', e.tipo]) });
  await p.publicar(inscripcionCreada(datos));
  assert.deepEqual(recibidos, [['a', 'INSCRIPCION_CREADA'], ['b', 'INSCRIPCION_CREADA']]);
});

test('quien se desuscribe deja de recibir avisos', async () => {
  const recibidos = [];
  const p = new PublicadorDeEventos();
  const cancelar = p.suscribir({ actualizar: () => recibidos.push('x') });
  cancelar();
  await p.publicar(inscripcionCreada(datos));
  assert.equal(recibidos.length, 0);
});

test('un suscriptor que falla no impide que los demas reciban el aviso', async () => {
  const errores = [];
  const recibidos = [];
  const p = new PublicadorDeEventos({ alFallar: (error) => errores.push(error.message) });
  p.suscribir({ actualizar: () => { throw new Error('se cayo el correo'); } });
  p.suscribir({ actualizar: (e) => recibidos.push(e.tipo) });
  await p.publicar(inscripcionCreada(datos));
  assert.deepEqual(errores, ['se cayo el correo']);
  assert.deepEqual(recibidos, ['INSCRIPCION_CREADA']);
});

test('suscribir algo que no implementa actualizar() es un error', () => {
  assert.throws(() => new PublicadorDeEventos().suscribir({}), TypeError);
});

test('al crearse una inscripcion avisan el estudiante y coordinacion, con los textos del original', async () => {
  const m = mensajeriaFalsa();
  const p = new PublicadorDeEventos();
  p.suscribir(new NotificadorAlEstudiante(m));
  p.suscribir(new NotificadorACoordinacion(m));
  await p.publicar(inscripcionCreada(datos));
  assert.deepEqual(m.enviados, [
    { canal: 'EMAIL', destinatario: 'ana@correo.co', mensaje: 'quedaste inscrito en Arquitectura I. Valor $45000' },
    { canal: 'EMAIL', destinatario: 'coordinacion', mensaje: 'nuevo inscrito en Arquitectura I' },
  ]);
});

test('al retirarse tambien avisan los dos', async () => {
  const m = mensajeriaFalsa();
  const p = new PublicadorDeEventos();
  p.suscribir(new NotificadorAlEstudiante(m));
  p.suscribir(new NotificadorACoordinacion(m));
  await p.publicar(inscripcionRetirada(datos));
  assert.deepEqual(m.enviados.map((a) => a.mensaje), ['te retiraste de ARQ1', 'retiro en ARQ1']);
});

test('los eventos son inmutables', () => {
  const e = inscripcionCreada(datos);
  assert.throws(() => { 'use strict'; e.valor = 1; }, TypeError);
});
