# Arena del Saber · Gamificación para bachillerato

## Ejecutar (VS Code)
1. Abre la carpeta en VS Code.
2. Instala la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**.
(Los módulos ES y `fetch` no funcionan abriendo el archivo con doble clic.)

## Arquitectura
| Archivo | Responsabilidad |
|---|---|
| `js/config.js` | Carreras, cursos y reglas (puntos, tiempo, rondas) |
| `js/data.js` | Cargar y seleccionar preguntas |
| `js/game.js` | Lógica pura: turnos, puntaje, rachas, ranking |
| `js/storage.js` | Puntajes guardados (localStorage): top por carrera y curso |
| `js/ui.js` | Todo el DOM |
| `js/main.js` | Controlador: temporizador, teclado, flujo |
| `data/questions.json` | Banco `{carrera:{curso:[[pregunta,[A,B,C,D],idx]]}}` |
| `scripts/build_data.py` | CSV → JSON (`pip install pandas`) |

## Flujo de pantallas
`Registro` (modalidad, nombres, carrera, curso) → `Sala de preparación` (resumen, nº de preguntas, tiempo) → `Juego` → `Resultados`.
El registro se guarda en el navegador (localStorage) para la próxima clase.

## Puntajes
Al terminar cada partida se guardan solos. Verás si hubo **nuevo récord del curso**, el Top 5, y en el **Salón de la fama** el top 10 filtrable por carrera y curso. Los puntajes viven en el navegador del computador usado (si cambias de equipo o navegador, empiezan vacíos).

## Personalizar
- Cambiar carreras: edita `CAREERS` en `config.js` y las palabras clave en `build_data.py`.
- Usar tus propias preguntas: genera `data/questions.json` con el mismo formato.
