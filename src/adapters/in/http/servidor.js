import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { ErrorDeDominio } from '../../../domain/errores.js';
import { informeUsoIA } from '../../../domain/informeUsoIA.js';

const ESTADO_POR_TIPO = { validacion: 400, no_encontrado: 404, conflicto: 409 };
const PAGINA = fileURLToPath(new URL('../../../../public/index.html', import.meta.url));
const LIMITE_CUERPO = 100_000;

/** ADAPTADOR DE ENTRADA: traduce HTTP <-> casos de uso. No contiene reglas de negocio. */
export function crearServidor({ casosDeUso }) {
  const enviar = (res, estado, cuerpo) => {
    res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(cuerpo));
  };

  const leerJson = (req) =>
    new Promise((resolve, reject) => {
      let texto = '';
      req.on('data', (parte) => {
        texto += parte;
        if (texto.length > LIMITE_CUERPO) {
          req.destroy();
          reject(new ErrorDeDominio('CUERPO_MUY_GRANDE', 'El cuerpo es demasiado grande.', 'validacion'));
        }
      });
      req.on('end', () => {
        try {
          resolve(texto ? JSON.parse(texto) : {});
        } catch {
          reject(new ErrorDeDominio('JSON_INVALIDO', 'El cuerpo no es un JSON valido.', 'validacion'));
        }
      });
      req.on('error', reject);
    });

  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const ruta = url.pathname;
      const m = req.method;

      if (m === 'GET' && ruta === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(await readFile(PAGINA));
      }
      if (m === 'GET' && ruta === '/informe-ia') return enviar(res, 200, informeUsoIA());
      if (m === 'GET' && ruta === '/cursos') return enviar(res, 200, await casosDeUso.listarCursos.ejecutar());

      if (m === 'POST' && ruta === '/inscripciones') {
        const cuerpo = await leerJson(req);
        const i = await casosDeUso.inscribir.ejecutar({
          estudiante: cuerpo.estudiante,
          codigoCurso: cuerpo.codigoCurso,
          modalidad: cuerpo.modalidad,
        });
        return enviar(res, 201, i);
      }
      if (m === 'GET' && ruta === '/inscripciones') {
        const filtros = Object.fromEntries(
          ['estudiante', 'curso', 'estado'].filter((k) => url.searchParams.has(k)).map((k) => [k, url.searchParams.get(k)]),
        );
        return enviar(res, 200, await casosDeUso.listar.ejecutar(filtros));
      }

      const coincide = ruta.match(/^\/inscripciones\/(\d+)(\/retirar)?$/);
      if (coincide) {
        const id = Number(coincide[1]);
        if (m === 'GET' && !coincide[2]) return enviar(res, 200, await casosDeUso.consultar.ejecutar({ id }));
        if (m === 'POST' && coincide[2]) {
          return enviar(res, 200, await casosDeUso.retirar.ejecutar({ id }));
        }
      }
      return enviar(res, 404, { codigo: 'RUTA_NO_ENCONTRADA', mensaje: 'Ruta no encontrada.' });
    } catch (error) {
      if (error instanceof ErrorDeDominio) {
        return enviar(res, ESTADO_POR_TIPO[error.tipo] ?? 400, { codigo: error.codigo, mensaje: error.message });
      }
      console.error(error);
      return enviar(res, 500, { codigo: 'ERROR_INTERNO', mensaje: 'Error interno del servidor.' });
    }
  });
}
