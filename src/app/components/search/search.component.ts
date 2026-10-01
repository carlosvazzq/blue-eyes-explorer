import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { LoadState, toLoadState } from '../../models/load-state.model';
import { YugiohCard } from '../../models/yugioh.model';
import { YugiohService } from '../../services/yugioh.service';
import { CardComponent } from '../card/card.component';
import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, ReactiveFormsModule, CardComponent, StatusMessageComponent],
  template: `
    <h2>Buscador de cartas</h2>
    <label for="q" class="sr">Nombre de la carta</label>
    <input id="q" type="text" [formControl]="control" placeholder="Ej: Blue-Eyes, Dark Magician, Kuriboh" />

    @if (state$ | async; as state) {
      @if (state.status === 'success') {
        <p class="count">{{ state.data.length }} resultado(s)</p>
        <div class="grid">
          @for (c of state.data; track c.id) { <app-card [card]="c" /> }
        </div>
      } @else if (state.status === 'error') {
        <app-status-message kind="error" [message]="state.message" />
      } @else {
        <app-status-message [kind]="state.status" />
      }
    }
  `,
  styles: [`
    input { width:100%; max-width:520px; padding:.7rem 1rem; border-radius:8px; border:1px solid #3b82f6;
      background:#0b1b3a; color:#fff; font-size:1rem; }
    .sr { position:absolute; left:-9999px; }
    .count { color:#93c5fd; }
  `],
})
export class SearchComponent {
  private readonly service = inject(YugiohService);
  control = new FormControl('', { nonNullable: true });

  state$: Observable<LoadState<YugiohCard[]>> = this.control.valueChanges.pipe(
    startWith(''),                 // estado inicial (idle)
    map((v) => v.trim()),          // quita espacios
    debounceTime(400),             // espera 400 ms sin teclear: no hay petición por tecla
    distinctUntilChanged(),        // no repite la misma búsqueda
    switchMap((term) =>            // cancela la petición anterior si llega una nueva
      term.length < 2
        ? of<LoadState<YugiohCard[]>>({ status: 'idle' })
        : toLoadState(this.service.searchByName(term))
    )
  );
}
