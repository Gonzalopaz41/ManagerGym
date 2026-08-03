export interface RoutineCategory {
  id: string;
  name: string;
}

export interface RoutineExercise {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  category: RoutineCategory;
}

export interface RoutineItem {
  id: string;
  routineDayId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  suggestedWeight?: number | null;
  notes?: string | null;
  order: number;
  exercise: RoutineExercise;
}

export interface RoutineDay {
  id: string;
  name: string;
  order: number;
  routineId: string;
  items: RoutineItem[];
}

/** Lo que devuelve GET /clients/{clientId}/routines: sin días. */
export interface Routine {
  id: string;
  name: string;
  description?: string | null;
  clientId: string;
  isActive: boolean;
  createdAt: string;
}

/** Lo que devuelve GET /routines/{routineId}: con días y sus ejercicios. */
export interface RoutineDetail extends Routine {
  days: RoutineDay[];
}

export interface CreateRoutineItemPayload {
  exerciseId: string;
  sets: number;
  reps: number;
  suggestedWeight?: number;
  notes?: string;
  order: number;
}

export interface CreateRoutineDayPayload {
  name: string;
  order: number;
  items: CreateRoutineItemPayload[];
}

export interface CreateRoutinePayload {
  name: string;
  description?: string;
  days: CreateRoutineDayPayload[];
}

export interface RoutinesState {
  routines: Routine[];
  detail: RoutineDetail | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}
