import { Component, input } from '@angular/core';
import { CardSet } from '../../models/yugioh.model';

@Component({
  selector: 'app-printings-table',
  template: `
    @if (sets()?.length) {
      <div class="wrap">
        <table>
          <thead><tr><th>Expansión</th><th>Código</th><th>Rareza</th><th>Precio</th></tr></thead>
          <tbody>
            @for (s of sets() ?? []; track $index) {
              <tr [class.hl]="highlight() === s.set_name">
                <td>{{ s.set_name }}</td>
                <td>{{ s.set_code }}</td>
                <td>{{ s.set_rarity }}</td>
                <td>{{ price(s.set_price) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <p class="none">Sin impresiones registradas</p>
    }
  `,
  styles: [`
    .wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; font-size:.85rem; }
    th, td { text-align:left; padding:.45rem .6rem; border-bottom:1px solid #1e3a8a; }
    th { color:#93c5fd; }
    tr.hl { background:#1d4ed8; }
    .none { color:#94a3b8; }
  `],
})
export class PrintingsTableComponent {
  sets = input<CardSet[] | undefined>();
  highlight = input<string | null>(null);

  price(value?: string): string {
    return value && Number(value) > 0 ? '$ ' + value : 'N/D';
  }
}

