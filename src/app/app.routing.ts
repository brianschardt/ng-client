import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

//Auth
import { LoginComponent } from './components/auth/login/login.component';
//guards
import { ApiGuard } from './guards/api.guard';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',     component: HomeComponent,pathMatch: 'full' },

  { path: 'login',     component: LoginComponent,pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
