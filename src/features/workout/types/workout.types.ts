export interface Category {
  id: string;
  name: string;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  category: Category;
}

export interface CreateCategoryPayload {
  name: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface CreateExercisePayload {
  name: string;
  description?: string;
  categoryId: string;
}

export type UpdateExercisePayload = Partial<CreateExercisePayload>;

export interface WorkoutState {
  categories: Category[];
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}
