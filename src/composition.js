import { CalculadoraDeValor } from './domain/precio/CalculadoraDeValor.js';
import { ModalidadPresencial } from './domain/precio/ModalidadPresencial.js';
import { ModalidadVirtual } from './domain/precio/ModalidadVirtual.js';
import { ModalidadHibrida } from './domain/precio/ModalidadHibrida.js';
import { BecaPaga30 } from './domain/precio/BecaPaga30.js';
import { SinBeca } from './domain/precio/SinBeca.js';
import { PublicadorDeEventos } from './application/eventos/PublicadorDeEventos.js';
import { NotificadorAlEstudiante } from './application/notificadores/NotificadorAlEstudiante.js';
import { NotificadorACoordinacion } from './application/notificadores/NotificadorACoordinacion.js';
import { RegistroDeAuditoria } from './application/notificadores/RegistroDeAuditoria.js';
import { InscribirEstudiante } from './application/casos-de-uso/InscribirEstudiante.js';
import { ConsultarInscripcion } from './application/casos-de-uso/ConsultarInscripcion.js';
import { RetirarInscripcion } from './application/casos-de-uso/RetirarInscripcion.js';
import { ListarInscripciones } from './application/casos-de-uso/ListarInscripciones.js';
import { ListarCursos } from './application/casos-de-uso/ListarCursos.js';
import { CursosEnMemoria } from './adapters/out/CursosEnMemoria.js';
import { InscripcionesEnMemoria } from './adapters/out/InscripcionesEnMemoria.js';
import { MensajeriaEnConsola } from './adapters/out/MensajeriaEnConsola.js';

/**
 * RAIZ DE COMPOSICION: el unico lugar que conoce las clases concretas y las conecta.
 * Para cambiar memoria por base de datos se cambia aqui (y se agrega un adaptador nuevo).
 */
export function crearAplicacion({
  mensajeria = new MensajeriaEnConsola(),
  cursos = new CursosEnMemoria(),
  inscripciones = new InscripcionesEnMemoria(),
  alFallar = (error) => console.error('Fallo un aviso:', error.message),
  registrarAuditoria = (linea) => console.log(linea),
} = {}) {
  const calculadora = new CalculadoraDeValor({
    modalidades: [new ModalidadPresencial(), new ModalidadVirtual(), new ModalidadHibrida()],
    becas: [new BecaPaga30(), new SinBeca()],
  });

  const publicador = new PublicadorDeEventos({ alFallar });
  publicador.suscribir(new NotificadorAlEstudiante(mensajeria));
  publicador.suscribir(new NotificadorACoordinacion(mensajeria));
  publicador.suscribir(new RegistroDeAuditoria(registrarAuditoria));

  return {
    casosDeUso: {
      inscribir: new InscribirEstudiante({ cursos, inscripciones, calculadora, publicador }),
      consultar: new ConsultarInscripcion({ inscripciones }),
      retirar: new RetirarInscripcion({ cursos, inscripciones, publicador }),
      listar: new ListarInscripciones({ inscripciones }),
      listarCursos: new ListarCursos({ cursos }),
    },
    publicador,
    calculadora,
  };
}
