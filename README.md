# LOOP FAIL - Instalación Artística Interactiva

## 📖 Descripción

**LOOP FAIL** es una instalación artística interactiva que explora la cultura del fracaso en la formación de estudiantes de ingeniería, reconociendo el proceso iterativo como parte esencial del aprendizaje. El proyecto utiliza música degradada progresivamente y desafíos de teclado para crear una experiencia que culmina en un "colapso total", demostrando que en el fracaso encontramos armonía.

## 🎮 Mecánica del Juego

El juego consta de **4 secciones** con dificultad progresiva:

### Sección 1
- **Teclas por desafío**: 1 tecla
- **Total de desafíos**: 5
- **Tiempo por tecla**: 2.5 segundos
- **Mínimo para pasar**: 3 aciertos (60%)

### Sección 2
- **Teclas por desafío**: 2 teclas simultáneas (acordes)
- **Total de desafíos**: 10
- **Tiempo por tecla**: 3.0 segundos
- **Mínimo para pasar**: 6 aciertos (60%)

### Sección 3
- **Teclas por desafío**: 4 teclas simultáneas
- **Total de desafíos**: 16
- **Tiempo por tecla**: 4.0 segundos
- **Mínimo para pasar**: 10 aciertos (~63%)

### Sección 4
- **Teclas por desafío**: 6 teclas simultáneas
- **Total de desafíos**: 18
- **Tiempo por tecla**: 5.0 segundos
- **Mínimo para pasar**: 11 aciertos (~61%)

**Duración estimada**: 1.5 - 2 minutos por partida


## 🤖 Secuencia Visual de Robots

El juego muestra diferentes estados visuales del robot según la progresión:

1. **Sección 1** (playing): `r1_sentado.gif`
2. **Explosión 1**: `r1_explosion.gif` (2 segundos)
3. **Sección 2** (playing): `r2_cantando.gif`
4. **Explosión 2**: `r2_explosion.gif` (2 segundos)
5. **Sección 3** (playing): `r3_cantando.gif`
6. **Explosión 3**: `r1_explosion.gif` (reutilizado)
7. **Sección 4** (playing): `r3_cantando.gif`
8. **Explosión 4**: `r1_explosion.gif`
9. **Final**: `r3_sentado.gif` (pantalla de colapso)

GIFs ubicados en: `src/assets/robots/`

## 🎨 Estética Visual

- **Paleta de colores**: Azul/gris con tonos retro
- **Efectos CRT**: Scanlines, vignette, pixel grid
- **Tipografía**: Press Start 2P (estilo arcade)
- **Animaciones**: Framer Motion para transiciones suaves
- **Efectos especiales**: Flash rojo durante explosiones, chromatic aberration

## 🛠️ Tecnologías Utilizadas

- **React** 18.3.1
- **TypeScript** 5.6.2
- **Vite** 6.0.1
- **TailwindCSS** 3.4.15
- **Framer Motion** 11.14.4
- **React Router** 7.1.0

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   ├── robots/          # GIFs de robots
│   └── sounds/          # Archivos de audio MP3
├── components/
│   └── game/
│       ├── GameController.tsx      # Orquestador principal
│       ├── RobotDisplay.tsx        # Visualización de robots
│       ├── KeyboardChallenge.tsx   # Interfaz de desafíos
│       └── FinalCollapse.tsx       # Pantalla final
├── hooks/
│   ├── useGameState.tsx            # Lógica del juego
│   └── usePlayer.tsx               # Reproductor de audio
├── pages/
│   ├── WelcomePage.tsx             # Pantalla de inicio
│   └── GamePage.tsx                # Página del juego
└── context/
    └── PlayContextProvider.tsx     # Gestión de audio
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd arte-project

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:5173/`

### Build para Producción

```bash
npm run build
npm run preview
```

## 🎯 Cómo Jugar

1. Accede a la aplicación en el navegador
2. En la pantalla de bienvenida, haz clic en **"JUGAR"**
3. Observa las teclas que aparecen en pantalla
4. **Presiona las teclas mostradas** antes de que expire el tiempo
   - Sección 1: Presiona 1 tecla
   - Sección 2: Presiona 2 teclas **simultáneamente**
   - Sección 3: Presiona 4 teclas **simultáneamente**
   - Sección 4: Presiona 6 teclas **simultáneamente**
5. Completa el número mínimo de aciertos para avanzar
6. Al final, observa el "colapso total"

## 🎮 Pool de Teclas Disponibles

- A, S, D, F (lado izquierdo)
- J, K, L (lado derecho)


### Mensaje
El proyecto busca revalorizar el fracaso como parte fundamental del proceso de aprendizaje en ingeniería, mostrando que incluso en la degradación y el error, surge una forma de armonía y belleza.


### Mecánica de Progresión
- Timer individual por desafío
- Generación aleatoria de teclas
- Verificación de mínimo de aciertos
- Explosiones automáticas entre secciones

## 🐛 Debugging

Para ver logs detallados del juego, abre la consola del navegador (F12). Verás:
- 🔄 Inicialización del juego y secciones
- 🎯 Teclas objetivo para cada desafío
- ⌨️ Teclas presionadas por el usuario
- ✓ Aciertos y fallos
- 🎵 Carga de audio
- ⏰ Expiración de tiempo

## 👥 Créditos

Proyecto desarrollado como instalación artística para explorar la cultura del fracaso en la ingeniería.
