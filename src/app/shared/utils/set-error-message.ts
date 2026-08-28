import { HttpErrorResponse } from '@angular/common/http';

export const setErrorMessage = (error: Error | undefined) => {
  const cause = error?.cause as HttpErrorResponse;

  if (!cause) {
    return '';
  }

  if (cause.status === 0) {
    return 'Sem conexão com o servidor';
  }

  if (cause.error.message) {
    return cause.error.message;
  }

  return 'Erro desconhecido';
};
