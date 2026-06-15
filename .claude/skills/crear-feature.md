# Skill: Crear Feature

## Pasos

1. Creá /src/features/{nombre}/
2. Dentro creá esta estructura:
   - components/ → componentes de la feature
   - pages/ → pantallas completas
   - api/ → llamadas a la API
   - slice/ → asyncThunks y slice de Redux
   - types/ → interfaces y tipos TypeScript
   - hooks/ → hooks propios de la feature
   - index.ts → exporta todo lo público
3. Creá los servicios en api/ conectando spec/api-docs.json
4. Creá el slice en slice/ con sus asyncThunks
5. Creá componentes con la skill crear-componente
6. Creá páginas con la skill crear-pantalla
7. Registrá rutas en /src/router/AppRouter.tsx

## Reglas

- index.ts solo exporta lo que otras partes necesitan ver
- Todo lo interno de la feature queda privado
- No importar directamente de otras features
- Si algo se necesita en más de una feature, moverlo a /src/shared
- Ante dudas de estructura, consultame antes de crear
- React router declarative mode
