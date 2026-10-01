# Proyecto: Blue-Eyes Card Explorer (Angular)

## Reglas obligatorias
- Angular (última versión), componentes standalone, TypeScript estricto, HttpClient, RxJS.
- PROHIBIDO usar `any` para datos de la API: usar interfaces TypeScript.
- PROHIBIDO JSON local, mocks, datos escritos a mano de cartas o expansiones.
- Toda comunicación HTTP vive en `YugiohService`. Los componentes no usan HttpClient.
- Nombres de archivos: `*.component.ts`, `*.service.ts`, `*.model.ts`. Las clases terminan en
  `Component` / `Service` (no usar la convención sin sufijo).
- Usar `@if` / `@for` / `@switch` en plantillas y el pipe `async`.
- Código comentado en español, breve y claro (el equipo debe poder explicarlo).
- Nunca mostrar errores solo por consola: siempre UI de estado.

## API
Base: https://db.ygoprodeck.com/api/v7/cardinfo.php
- Búsqueda parcial: ?fname=
- Arquetipo: ?archetype=Blue-Eyes
- Por id: ?id=
- Sin resultados = HTTP 400 → tratarlo como lista vacía (estado Empty), NO como Error.
- Respuesta: { data: YugiohCard[] }

## Estados de UI
Loading, Success, Empty, Error (+ idle en el buscador).