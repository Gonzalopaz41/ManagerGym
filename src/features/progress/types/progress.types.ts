export interface ProgressCategory {
  id: string;
  name: string;
}

/**
 * `category` solo viene en GET /clients/{clientId}/progress.
 * El filtrado por ejercicio (GET .../progress/{exerciseId}) devuelve el
 * ejercicio sin su categoría, por eso es opcional.
 */
export interface ProgressExercise {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  category?: ProgressCategory;
}

export interface ProgressRecord {
  id: string;
  clientId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number | null;
  notes?: string | null;
  recordedAt: string;
  createdAt: string;
  exercise: ProgressExercise;
}

export interface CreateProgressPayload {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  recordedAt: string;
}

export interface ProgressState {
  records: ProgressRecord[];
  loading: boolean;
  error: string | null;
}
