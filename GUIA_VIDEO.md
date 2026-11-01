# Guía de video académico (6:30)

## Preparación

- Ejecuta `npm test` y `npm run typecheck` antes de grabar.
- Abre la app en un emulador o dispositivo en vertical y reinicia el encuentro.
- Verifica estado inicial: 5/5/5, 15 puntos, 100 HP, 0/20 kg y poder 40.
- Deja VS Code con pestañas abiertas en `src/store/index.ts`, los tres slices, `selectors.ts` y `combatActions.ts`.
- Aumenta el tamaño de fuente del editor y silencia notificaciones.
- Graba tu voz o aparece en cámara; el taller es individual.

## 0:00 - 1:30 | Problema arquitectónico

### Qué mostrar

La app completa, recorriendo brevemente las zonas A, B, C y D.

### Qué decir

> "HeroForge tiene cuatro componentes hermanos: el HUD, el entrenamiento, la armería y el inspector. Todos necesitan observar partes relacionadas del mismo juego. Si guardara copias con useState o pasara datos por varios niveles, aparecerían prop drilling y valores desincronizados. Por eso el estado compartido vive en Redux Toolkit. El flujo es unidireccional: la interfaz despacha una acción, un reducer actualiza el Store, los selectores derivan resultados y React vuelve a renderizar solamente a los suscriptores necesarios."

### Concepto demostrado

Una fuente de verdad y ausencia de comunicación por props entre las cuatro zonas.

## 1:30 - 3:30 | Demostración visual

### 1:30 - 2:10: efecto dominó

1. Señala estado inicial: capacidad 20, poder 40 y clase Aldeano.
2. En zona C toca una vez **Armadura Maldita**.
3. Recorre las cuatro zonas sin tocar nada más.

Di:

> "Este fue un solo `inventory/toggleEquipItem`. En A aparece Tanque Pesado y la alerta; en B STR efectivo pasa de 5 a 8; en C tengo 30 kg sobre 26; en D el poder baja de 49 bruto a 34 por la penalización y aparece el tipo real de la acción. No sincronicé manualmente ninguno de esos valores."

### 2:10 - 2:40: preset

1. Desequipa todo.
2. Toca **Mago** en zona B.
3. Muestra 5/5/20, cero puntos, aura de Archimago y `stats/applyBuildPreset` con `MAGE`.

Di:

> "El preset cambia cuatro campos con un único dispatch y reemplaza la distribución anterior. Aplicarlo repetidamente no acumula puntos."

### 2:40 - 3:30: combate y daño

1. Baja a zona D.
2. Toca **Atacar al jefe** dos veces.
3. Muestra HP del jefe, HP del héroe, daño y las acciones `stats/attackBoss` y `stats/takeDamage`.
4. Toca **Curar al héroe** o **Reiniciar**.

Di:

> "El componente no calcula el golpe. Un thunk lee el poder vigente, despacha daño al jefe y, si sigue vivo, el contraataque. Las barras leen el mismo Store."

## 3:30 - 5:30 | Recorrido por el código

### 3:30 - 3:55: Store

Abre `src/store/index.ts`.

> "configureStore combina exactamente stats, inventory y actionLog. Aquí también exporto RootState, AppDispatch y hooks tipados. App solo instala Provider y monta cuatro hermanos."

### 3:55 - 4:25: reducer e Immer

Abre `src/store/slices/inventorySlice.ts` y señala `toggleEquipItem`.

> "La acción lleva un ID string. La sintaxis parece mutación, pero Redux Toolkit usa Immer para producir un estado nuevo e inmutable. IDs inexistentes se ignoran y no se crean duplicados."

Menciona brevemente `statsSlice.ts`: presupuesto 30, HP acotado y presets.

### 4:25 - 4:50: inspector real

Abre `actionLogSlice.ts`.

> "El log no simula eventos desde la interfaz. extraReducers e isAnyOf escuchan las acciones reales de stats e inventory, agregan un ID estable y recortan a cinco eventos."

### 4:50 - 5:20: selectores

Abre `src/store/selectors.ts` en `selectTotalStats`, `selectIsOverencumbered` y `selectCombatPower`.

> "Peso, capacidad, poder y clase se pueden recalcular a partir del estado base. Guardarlos duplicados permitiría contradicciones. createSelector combina slices y memoiza resultados. La igualdad no sobrecarga; solamente peso mayor a capacidad."

### 5:20 - 5:30: combate

Abre `src/features/combat/combatActions.ts`.

> "El thunk puede consultar el selector actual antes de despachar. Los reducers siguen puros: sin tiempo, azar ni efectos secundarios."

## 5:30 - 6:30 | Conclusión

> "Usaría useState para estado local y efímero, por ejemplo si un modal está abierto o una animación puntual. Escalaría a Redux cuando varias zonas distantes leen o modifican los mismos datos, cuando existen reglas cruzadas o cuando necesito trazabilidad y pruebas deterministas. HeroForge muestra ese umbral: equipar un objeto afecta estadísticas, apariencia, carga, combate e historial, pero sigue existiendo una sola fuente de verdad."

Cierra mostrando nuevamente el inspector y la app completa.

## Lista de comprobación final

- [ ] La grabación dura entre 5 y 7 minutos.
- [ ] Se escucha tu voz o apareces en cámara.
- [ ] Se demuestra Armadura Maldita con un solo toque.
- [ ] Se ve la alerta de sobrecarga y poder 34.
- [ ] Se demuestra al menos un preset y su action type.
- [ ] Se realiza un turno de combate.
- [ ] Se muestran Store, tres slices, Immer, selectores y thunk.
- [ ] Se explica por qué no se guarda estado derivado.
- [ ] Se responde useState local frente a Redux global.
- [ ] No aparecen claves, notificaciones ni información privada en pantalla.
