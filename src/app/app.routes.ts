import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { BlueEyesComponent } from './components/blue-eyes/blue-eyes.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'blue-eyes', component: BlueEyesComponent },
  { path: 'card/:id', component: CardDetailComponent },
  { path: '**', redirectTo: '' },
];