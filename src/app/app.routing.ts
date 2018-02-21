import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

//Auth
import { LoginComponent } from './components/auth/login/login.component';
//Guards
import { ApiGuard } from './guards/api.guard';

//User
import { ProfileComponent } from './components/user/profile/profile.component';

//Company
import { CompanyCreateComponent } from './components/company/company-create/company-create.component';
import { CompanyListComponent } from './components/company/company-list/company-list.component';
import { CompanyUpdateComponent } from './components/company/company-update/company-update.component';

const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',           component: HomeComponent,pathMatch: 'full' },

  { path: 'login',          component: LoginComponent,pathMatch: 'full' },

  { path: 'user/update',     component: ProfileComponent,canActivate:[ApiGuard], pathMatch: 'full' },

  { path: 'company/create',     component: CompanyCreateComponent, canActivate:[ApiGuard], pathMatch: 'full' },
  { path: 'company/list',       component: CompanyListComponent,   canActivate:[ApiGuard], pathMatch: 'full' },
  { path: 'company/update/:id', component: CompanyUpdateComponent, canActivate:[ApiGuard], pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
