import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

// Unión discriminada: cada estado de la UI y los datos que lo acompañan
export type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

export function toLoadState<T>(source$: Observable<T[]>): Observable<LoadState<T[]>> {
  return source$.pipe(
    // lista con elementos -> success, lista vacía -> empty
    map((list): LoadState<T[]> =>
      list.length ? { status: 'success', data: list } : { status: 'empty' }
    ),
    // cualquier fallo se convierte en un estado visible en la UI
    catchError(() =>
      of<LoadState<T[]>>({
        status: 'error',
        message: 'No se pudo conectar con YGOPRODeck. Revisa tu conexión e inténtalo de nuevo.',
      })
    ),
    // al suscribirse emite primero "loading"
    startWith<LoadState<T[]>>({ status: 'loading' })
  );
}