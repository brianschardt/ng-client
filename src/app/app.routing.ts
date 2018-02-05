import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
//guards
import { ApiGuard } from './guards/api.guard';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',     component: HomeComponent,pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
