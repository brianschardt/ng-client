import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatMenuModule, MatIconModule } from '@angular/material';

import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { FormsModule } from '@angular/forms';
import { FacebookModule } from 'ngx-facebook';
//services
import { EnvService } from './services/env.service';
import { UtilService } from './services/util.service';
import { CookieService } from 'ngx-cookie-service';

//guards
import { ApiGuard } from './guards/api.guard';

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { NavbarComponent } from './components/partials/navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    NavbarComponent,

  ],
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    FacebookModule.forRoot(),
  ],
  providers: [
    UtilService,
    EnvService,
    CookieService,
    ApiGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
