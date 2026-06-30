interface ErrorMessages {
  400?: string;
  401?: string;
  404?: string;
  default?: string;
}

export const getApiError = (err: any, messages: ErrorMessages = {}): string => {
  if (!err?.response) return 'Sin conexión. Revisá tu internet.';

  const status: number = err.response.status;

  if (status === 400) return messages[400] ?? 'Los datos ingresados son inválidos.';
  if (status === 401) return messages[401] ?? 'Tu sesión expiró. Volvé a iniciar sesión.';
  if (status === 404) return messages[404] ?? 'No se encontró el recurso solicitado.';
  if (status >= 500)  return 'Error del servidor. Intentá de nuevo más tarde.';

  return messages.default ?? 'Ocurrió un error inesperado. Intentá de nuevo.';
};
