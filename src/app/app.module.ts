import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AdminService } from './admin/admin.service';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './loading/loading.component';
import { DisableInteractionDirective } from './shared/disable-interaction.directive';
import { LoadingService } from './loading/loading.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';

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
  ],
  declarations: [
    LoadingComponent,
    DisableInteractionDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AdminService,
    LoadingService
  ],
  bootstrap: [LoadingComponent]
})
export class AppModule {}
