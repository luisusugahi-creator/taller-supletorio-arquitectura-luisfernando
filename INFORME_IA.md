# Informe de uso de herramientas de IA

**Estudiante:** Luis Fernando Úsuga Higuita · **Taller:** Supletorio IS066, Caso C (Inscripción a cursos)

## Herramienta y versión

- Claude Code, con el modelo Claude Sonnet 5.5 (Anthropic).

## ¿Usé IA?

Sí. La usé para casi todo el taller. Lo declaro porque el enunciado lo permite si se informa con honestidad y si yo reviso y entiendo lo entregado.

## Qué hizo la IA y qué hice yo, por parte

| Parte | Qué hizo la IA | Qué hice yo | % aprox. de código generado por IA |
|---|---|---|---|
| Código original (`original/`) | Reconstruyó el código espagueti a partir del enunciado y numeró las líneas. | Lo leí y comprobé que los problemas señalados en la Parte 1 realmente ocurren. | 90 % |
| Parte 1 (tabla de principios) | Redactó la tabla con líneas, consecuencias y soluciones. | Revisé cada fila contra el código y la reescribí en mis palabras donde hizo falta. | 85 % |
| Parte 2 (Strategy y Observer) | Escribió las clases, las pruebas y la explicación de roles. | Revisé los roles frente a refactoring.guru, ejecuté las pruebas y entendí el flujo de cada patrón. | 90 % |
| Parte 3 (hexagonal) | Escribió dominio, casos de uso, adaptadores, servidor, página y pruebas. | Ejecuté `npm test` y `npm start`, probé las operaciones y revisé la justificación de la arquitectura. | 90 % |
| Extensión | Escribió `ModalidadHibrida`, `RegistroDeAuditoria` y su prueba. | Verifiqué que solo cambió `composition.js`. | 90 % |
| README e informe | Redactó los borradores. | Los revisé y ajusté para que digan lo que realmente entiendo. | 85 % |

## Porcentaje global y cómo lo calculé

**Estimación global: 90 %** del código generado por IA. Lo calculé de forma aproximada, comparando cuánto del código que se ejecuta escribió la herramienta frente a lo que yo cambié a mano. No medí líneas una por una; es una estimación honesta, no un conteo exacto. El mismo valor está en `informeUsoIA()` (`src/domain/informeUsoIA.js`).

## Prompts clave que usé

1. Pegué el enunciado del taller y el caso C y pedí que se hiciera el trabajo completo, con un commit por parte.
2. Pedí que la explicación y la guía para el video estuvieran en lenguaje sencillo, para poder sustentarlo.
3. Pedí usar arquitectura hexagonal con Strategy y Observer, y probar que la extensión no modifica clases existentes.

## Qué corregí o rechacé

- En el código original, la herramienta tuvo que reconstruir líneas que se veían cortadas en el PDF; ajusté los números de línea para que la tabla de la Parte 1 coincida con el archivo.
- Una prueba HTTP inicial fallaba porque esperaba un error `400` por modalidad inválida en un curso que ya estaba lleno, y la regla de cupo se evalúa antes. Se corrigió la prueba, no la regla.
- Dejé dicha una limitación en vez de ocultarla: la lista de modalidades de la página no incluye `hibrida`.

## Qué puedo explicar sin ayuda

- Por qué el código original viola SRP, OCP, DIP, DRY, KISS y cómo cada problema se resolvió.
- Cómo funcionan Strategy (calculadora + estrategias) y Observer (publicador + suscriptores), y qué rol cumple cada clase.
- La arquitectura hexagonal: dominio, puertos, adaptadores, casos de uso y raíz de composición.
- Qué archivos cambian si paso de memoria a base de datos.
- Cómo se agregó la modalidad híbrida y la auditoría sin tocar las clases existentes.
