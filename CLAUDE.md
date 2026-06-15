#ManagerGym - Contexto

## Que es

Es un proyecto pensado para administrar un gimnasio de calistenia

##Stack

- Fontend: React + tailwind + ShadCN + Redux Toolkit
- Backend: NestJs + PostgreSQL + TypeORM

## Arquitectura

El proyecto usa arquitectura por features.

- Cada feature vive en /src/features/{nombre}/
- Componentes compartidos en /src/shared/
- Componentes generados por ShadCN en /src/components/ui/
- helpers compartidos en src/helpers/
- Hooks compartidos en src/hooks/
- Una feature NO importa directamente de otra feature
- Ante dudas de donde va algo, consultame antes de crearlo

## Estado actual

esta creada la estructura de carpetas

## Documentacion API

Esta en spec/api-docs.json
Siempre consultala antes de conectar un endpoint.

## Diseño visual

Esta en spec/diseño.md
Siempre siguelo para colores, tipografia y componentes.

## Skills disponibles

- crear-componente -> .claude/skills/crear-componente.md
- crear-pantalla -> .claude/skills/crear-pantalla.md
- crear-feature -> .claude/skills/crear-feature.md

## Reglas generales

- no trabajaras en el Backend.
- Siempre manejar estados: loading, error, success
- En reduxToolkit usa las asyncThunks
- Ante cualquier decision de arquitectura consultame
