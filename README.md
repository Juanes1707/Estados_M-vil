# HeroForge RPG

Aplicación móvil educativa construida con React Native, Expo, TypeScript y Redux Toolkit. Su objetivo es hacer visible el flujo unidireccional de Redux: una interacción despacha una acción, los reducers actualizan el Store, los selectores recalculan valores derivados y cuatro componentes independientes reaccionan sin prop drilling.

## Stack

- Expo SDK 58 y React Native 0.88.
- TypeScript en modo estricto.
- Redux Toolkit y React Redux.
- Vitest para pruebas unitarias e integradas.
- Estilos nativos, emojis locales y `Animated`; no requiere imágenes ni servicios externos.

## Instalación y ejecución

Requisito: Node.js 20.19 o superior.

```bash
npm install
npm start
```

En la terminal de Expo:

- `a`: abrir Android (emulador configurado).
- `w`: abrir versión web.
- Escanear el QR con Expo Go compatible para usar un dispositivo físico.

Comandos directos:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
npm test
npm run test:coverage
```

La compilación nativa de iOS requiere macOS; Expo Go permite probar el proyecto sin generar el binario localmente.

## Estructura principal

```text
App.tsx
src/
  components/
    HeroAvatarHUD.tsx
    StatsControlPanel.tsx
    ArmoryGrid.tsx
    ReduxLiveInspector.tsx
    ui.tsx
  data/items.ts
  features/combat/combatActions.ts
  store/
    index.ts
    selectors.ts
    slices/
      statsSlice.ts
      inventorySlice.ts
      actionLogSlice.ts
  theme/colors.ts
  types/game.ts
tests/
  statsSlice.test.ts
  inventorySlice.test.ts
  selectors.test.ts
  store.integration.test.ts
DECISIONES_TECNICAS.md
GUIA_VIDEO.md
```

## Arquitectura Redux

`App.tsx` solamente establece el `Provider` y monta cuatro componentes hermanos. Cada zona usa hooks tipados y se suscribe directamente a los selectores que necesita.

1. `statsSlice`: atributos base, puntos disponibles, HP del héroe y estado real del encuentro contra el jefe.
2. `inventorySlice`: catálogo inmutable y lista de identificadores equipados.
3. `actionLogSlice`: escucha acciones reales de los otros slices mediante `extraReducers` e `isAnyOf`, y conserva las cinco más recientes.

El thunk `performCombatTurn` consulta el Store, obtiene `selectCombatPower`, calcula el daño y despacha `attackBoss` y, si el jefe sigue vivo, `takeDamage`. Los reducers permanecen puros y deterministas.

## Estado derivado y fórmulas

Los resultados calculables no se guardan en los slices:

```text
STR total = STR base + bonos de equipo
AGI total = AGI base + bonos de equipo
INT total = INT base + bonos de equipo
Capacidad = 10 + (STR total * 2)
Sobrecarga = peso total > capacidad
Poder bruto = STR total * 3 + AGI total * 2 + INT total * 3
Poder con sobrecarga = round(poder bruto * 0.7)
Velocidad = AGI total * 10; con sobrecarga se multiplica por 0.5
Potencial mágico = min(100, INT total * 5)
Daño al jefe = max(1, round(poder actual * 0.25))
```

La igualdad entre peso y capacidad no es sobrecarga. La clase visual sigue este orden: `Tanque Pesado` por sobrecarga; después STR, INT y AGI dominantes con umbral 15; finalmente `Aldeano`. Ese orden también resuelve empates de forma determinista.

## Las cuatro zonas

- **A - HeroAvatarHUD:** observa clase, aura, arma, vida, potencial mágico, carga y estadísticas efectivas.
- **B - StatsControlPanel:** despacha incrementos, decrementos, presets, reset y curación. Distingue base, bono y total.
- **C - ArmoryGrid:** equipa los seis objetos libremente y muestra sobrecarga, capacidad y peso.
- **D - ReduxLiveInspector:** ejecuta el combate y muestra `action.type` y payload de las cinco acciones reales más recientes.

## Escenarios de demostración

### Efecto dominó

1. Iniciar con STR/AGI/INT en 5, 15 puntos, 0 kg, capacidad 20 y poder 40.
2. Tocar una vez **Armadura Maldita**.
3. Verificar STR efectivo 8, capacidad 26 kg, peso 30 kg, sobrecarga, poder 34 y clase Tanque Pesado.
4. Confirmar que las zonas A, B, C y D cambian por el mismo `inventory/toggleEquipItem`.

### Preset Mago

1. Tocar **Mago**.
2. Verificar un solo `stats/applyBuildPreset` con payload `MAGE`.
3. Confirmar 5/5/20, cero puntos, clase Archimago y poder recalculado.

### Combate

1. Tocar **Atacar al jefe**.
2. Observar `stats/attackBoss` y `stats/takeDamage` en el inspector.
3. Cambiar atributos o equipo y comprobar que el siguiente golpe usa el poder vigente.

## Estado local frente a Redux

Redux almacena datos compartidos que deben permanecer coherentes entre zonas: atributos, HP, equipamiento, jefe e historial. `useState` sería apropiado para detalles efímeros de una sola vista, como un modal abierto o una pestaña visual. Esta implementación usa `Animated.Value` exclusivamente para feedback de presentación; no duplica estado del juego.

## Pruebas

`npm test` ejecuta 24 casos sobre reducers, selectores e integración. Incluye presupuesto de puntos, presets consecutivos, límites de HP, inventario, igualdad del límite de carga, penalizaciones, clases, historial, combate y el escenario completo de Armadura Maldita.

Consulta [DECISIONES_TECNICAS.md](./DECISIONES_TECNICAS.md) para la trazabilidad de la rúbrica y [GUIA_VIDEO.md](./GUIA_VIDEO.md) para el guion de sustentación.
