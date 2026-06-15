#Skill: Crear Pantalla

## Pasos

1. Crea el archivo en /src/features/{feature}/pages/
2. Registra la ruta en /src/router/AppRouter.tsx o en el router de su respectiva feature
3. Usa componentes de la misma feature o de /shared
4. Conecta los endpoints segun spec/api-docs.json

##Reglas

- Una pagina solo orquesta componentes
- Siempre manejar 401 -> redirect a login
- Mobile first
- Segui spec/diseño.md
