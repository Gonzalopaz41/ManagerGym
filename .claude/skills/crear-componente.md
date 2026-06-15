# Skill: Crear Componente

## Cuándo usarla

Siempre que se necesite un componente nuevo de UI.

## Pasos

1. Identificá a qué feature pertenece
2. Creá el archivo en /src/features/{feature}/components/
3. Si es reutilizable entre features → /src/shared/components/
4. Exportá desde el index.ts de la feature

## Estructura base con llamada a API

```tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

const NombreComponente = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.nombreSlice,
  );

  useEffect(() => {
    dispatch(nombreAsyncThunk());
  }, [dispatch]);

  if (loading) return <Skeleton />;
  if (error) return <p className="text-red-500">{error}</p>;
  return <div>{/* UI acá */}</div>;
};

export default NombreComponente;
```

## Estructura base sin llamada a API

```tsx
const NombreComponente = () => {
  return <div>{/* UI acá */}</div>;
};

export default NombreComponente;
```

## Reglas

- Tailwind para estilos, sin CSS externo
- Siempre usar componentes ShadCN antes de crear uno desde cero
- Redux Toolkit con asyncThunks para estado global
- useState para estado local
- Íconos siempre con lucide-react
- Siempre manejar los tres estados: loading → Skeleton,
  error → mensaje en rojo, success → UI final
- Seguir colores y tipografía de spec/diseño.md
