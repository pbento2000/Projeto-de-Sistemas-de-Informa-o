import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './customRouteReuseStrategy';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from 'ngx-clipboard';
import { AlertModule } from './alert';
import { NgxFileDropModule } from 'ngx-file-drop';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import { UploadManyComponent } from './upload-many/upload-many.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';

const appRoutes: Routes = [
  { path: '',  component: HomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'uploadMany', component: UploadManyComponent},
  { path: 'photo/:id', component: PhotoDetailsComponent},
  { path: 'profile/:username', component: ProfileComponent},
  { path: 'favoritos/:username', component: HomeComponent},
  { path: 'populares', component: HomeComponent},
  
  // redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    UploadComponent, 
    UploadManyComponent,
    NavbarComponent,
    ProfileComponent,
    PhotoDetailsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModalModule,
    ClipboardModule,
    AlertModule,
    NgxFileDropModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true, } // <-- debugging purposes only
    ),
    NoopAnimationsModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
