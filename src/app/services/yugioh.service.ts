import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { YgoApiResponse, YugiohCard } from '../models/yugioh.model';

@Injectable({ providedIn: 'root' })
export class YugiohService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
  private blueEyes$?: Observable<YugiohCard[]>;

  // Petición base. La API responde HTTP 400 cuando no hay coincidencias,
  // así que el 400 se trata como lista vacía (estado Empty) y no como error.
  private query(params: Record<string, string>): Observable<YugiohCard[]> {
    return this.http.get<YgoApiResponse>(this.baseUrl, { params }).pipe(
      map((res) => res.data ?? []),
      catchError((err: HttpErrorResponse) =>
        err.status === 400 ? of<YugiohCard[]>([]) : throwError(() => err)
      )
    );
  }

  // Búsqueda parcial por nombre (fname)
  searchByName(term: string): Observable<YugiohCard[]> {
    return this.query({ fname: term });
  }

  // Cartas del arquetipo Blue-Eyes, con caché para no repetir la consulta
  getBlueEyes(): Observable<YugiohCard[]> {
    if (!this.blueEyes$) {
      this.blueEyes$ = this.query({ archetype: 'Blue-Eyes' }).pipe(
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.blueEyes$;
  }

  getById(id: string): Observable<YugiohCard | undefined> {
    return this.query({ id }).pipe(map((cards) => cards[0]));
  }
}
