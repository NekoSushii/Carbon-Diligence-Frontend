import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from './admin/admin.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingService } from './loading-screen/loading.service';
import { SharedModule } from './shared.module';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    LoadingScreenComponent,
    SharedModule,
  ],
  declarations: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AdminService,
    LoadingService,
    CookieService
  ],
  bootstrap: []
})
export class AppModule {}
