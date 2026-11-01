# Decisiones técnicas y trazabilidad

## Decisiones donde el taller dejaba margen

| Decisión | Implementación | Motivo |
|---|---|---|
| Vida del jefe | `bossHp`, `lastHeroDamage` y `lastBossDamage` viven en `statsSlice` | Son estado real del encuentro. Mantiene exactamente tres slices principales. |
| Combate | Thunk `performCombatTurn` | Puede leer el Store y selectores antes de despachar reducers puros. |
| Contraataque | 12 HP fijos si el jefe sobrevive | Mecánica reproducible y sencilla de explicar. |
| Velocidad | `AGI total * 10`, reducida 50% con sobrecarga | Hace visible una unidad clara sin guardarla en el Store. |
| Maná | Potencial `min(100, INT total * 5)` | El taller no define consumo; se presenta como potencial, no recurso mutable. |
| Empates de clase | STR, luego INT, luego AGI | Orden determinista documentado. Sobrecarga siempre tiene prioridad. |
| ID del log | Contador serializable dentro de `actionLogSlice` | Es estable, predecible y evita `Date.now()`/`Math.random()` en reducers. |
| Reinicio | `resetStats` solo restaura atributos; `healHero` restaura vida; `restartEncounter` restaura jefe y héroe | Evita mezclar responsabilidades y permite demostrar acciones separadas. |
| UI | Una sola pantalla vertical | El taller evalúa cuatro zonas simultáneas; la navegación no aporta al objetivo. |

## Matriz requisito - evidencia

| Requisito | Archivos responsables | Evidencia |
|---|---|---|
| Store con `stats`, `inventory`, `actionLog` | `src/store/index.ts` | `configureStore`, tipos y hooks tipados. |
| Tres slices separados | `src/store/slices/*.ts` | Reducers con `PayloadAction`; sin lógica visual. |
| Presupuesto de atributos | `statsSlice.ts`, `tests/statsSlice.test.ts` | Suma base + puntos igual a 30 y mínimo 1. |
| Presets en un dispatch | `statsSlice.ts`, `StatsControlPanel.tsx` | `applyBuildPreset` reemplaza la distribución. |
| Seis objetos | `src/data/items.ts`, `inventorySlice.ts` | Catálogo completo; equipamiento libre. |
| Historial real de cinco acciones | `actionLogSlice.ts`, `ReduxLiveInspector.tsx` | `extraReducers`, `isAnyOf`, tipos reales y payload legible. |
| Estado derivado cruzado | `src/store/selectors.ts` | Totales, peso, capacidad, penalizaciones, clase y HUD. |
| Cuatro componentes hermanos | `App.tsx`, `src/components/*.tsx` | Sin props de negocio ni estado centralizado en App. |
| Avatar/HUD reactivo | `HeroAvatarHUD.tsx` | Aura, clase, arma, barras, salud y sobrecarga. |
| Controles de atributos | `StatsControlPanel.tsx` | Botones deshabilitados, base/bono/total, presets y curación. |
| Armería responsive | `ArmoryGrid.tsx` | Cuadrícula adaptable, resaltado, peso y alerta. |
| Arena e inspector | `ReduxLiveInspector.tsx` | Jefe, barras, daño, victoria/derrota y acciones. |
| Poder fuera de la UI | `selectors.ts`, `combatActions.ts` | El thunk consume `selectCombatPower`; no se duplica. |
| Efecto dominó | `tests/store.integration.test.ts` | Un dispatch verifica inventario, selectores y log. |
| Verificación automatizada | `tests/*.test.ts`, `package.json` | 24 casos con Vitest y script TypeScript. |
| Documentación y video | `README.md`, `GUIA_VIDEO.md` | Instalación, arquitectura, demo y guion cronometrado. |

## Autoevaluación contra la rúbrica

| Criterio | Evidencia preparada | Estado |
|---|---|---|
| Arquitectura y Store (25) | Tres slices, hooks tipados, thunk y reducers puros | Cubierto por código y pruebas |
| Estado derivado (20) | Selectores memoizados que cruzan stats e inventory | Cubierto por código y pruebas |
| Feedback visual (25) | Cuatro zonas reactivas, barras, alertas, aura e inspector | Implementado; validar en dispositivo antes de entregar |
| Video explicativo (30) | Guion de 6:30 con acciones, archivos y conceptos | Preparado; la grabación y narración son del estudiante |

La matriz muestra evidencia disponible; no constituye una garantía de calificación.
