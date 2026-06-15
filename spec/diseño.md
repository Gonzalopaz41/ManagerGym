# Diseño Visual

## Estilo general

- Minimalista, dark mode, negro puro
- Referencia: Vercel Dashboard
- Alto contraste, tipografía limpia, sin elementos decorativos
- Toda la UI debe sentirse funcional y profesional

## Colores

- Fondo principal: #000000
- Fondo secundario: #0a0a0a
- Fondo tarjetas: #111111
- Borde: #222222
- Borde hover: #333333
- Acento: #ffffff
- Acento secundario: #888888
- Texto principal: #ffffff
- Texto secundario: #888888
- Texto deshabilitado:#444444
- Error: #ff4444
- Éxito: #00cc88
- Warning: #ffaa00

## Tipografía

- Fuente: Geist Sans (si no está disponible, Inter)
- Título de página: 24px / font-bold
- Título de sección: 18px / font-semibold
- Texto normal: 14px / font-normal
- Texto secundario: 13px / font-normal / color texto secundario
- Texto pequeño: 12px / font-normal
- Labels de inputs: 13px / font-medium

## Espaciados

- Padding de página: 24px
- Padding de card: 20px
- Gap entre secciones: 32px
- Gap entre componentes: 16px
- Gap entre elementos UI: 8px

## Componentes ShadCN utilizados

Button, Input, Card, CardHeader, CardContent,
CardFooter, Dialog, Select, Badge, Table,
TableHeader, TableBody, TableRow, TableCell,
Separator, Skeleton, Toast, Tooltip, Avatar,
DropdownMenu, Sheet

## Estilos de componentes

### Button

- Primario: fondo blanco, texto negro, hover fondo #e0e0e0
- Secundario: fondo transparente, borde #222, texto blanco, hover borde #444
- Destructivo: fondo transparente, borde #ff4444, texto #ff4444
- Tamaño base: height 36px, padding horizontal 16px
- Border radius: 6px

### Input

- Fondo: #0a0a0a
- Borde: #222222
- Borde focus: #ffffff
- Texto: #ffffff
- Placeholder: #444444
- Border radius: 6px
- Height: 36px

### Card

- Fondo: #111111
- Borde: #222222
- Border radius: 8px
- Sin sombra

### Badge

- Default: fondo #222, texto #fff
- Éxito: fondo #00cc8820, texto #00cc88, borde #00cc8840
- Error: fondo #ff444420, texto #ff4444, borde #ff444440
- Warning: fondo #ffaa0020, texto #ffaa00, borde #ffaa0040

### Table

- Header: fondo #0a0a0a, texto #888888, font-medium
- Fila: borde inferior #111111
- Fila hover: fondo #0f0f0f
- Texto: #ffffff

## Layout del Dashboard

### Sidebar

- Ancho: 240px
- Fondo: #000000
- Borde derecho: #222222
- Links activos: fondo #111111, texto blanco
- Links inactivos: texto #888888, hover texto blanco

### Header

- Height: 56px
- Fondo: #000000
- Borde inferior: #222222

### Contenido principal

- Fondo: #000000
- Padding: 24px
- Max width: 1200px

## Reglas generales

- Nunca usar sombras, reemplazarlas con bordes
- Nunca usar colores de acento de colores (azul, violeta, etc)
  todo el acento es blanco/gris
- Bordes siempre sutiles, nunca llamativos
- Animaciones mínimas, solo lo necesario
- Siempre preferir componentes ShadCN antes de crear uno desde cero
- Mobile first: diseñar primero para móvil, luego desktop
- Los íconos usar lucide-react
