import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthGuard } from './guards/auth.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { HomeComponent } from './views/home/home.component';
import { AuthenticationComponent } from './views/authentication/authentication.component';
import { SpinnerModule } from './shared/spinner/spinner.module';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { ToastComponent } from './shared/toast/toast.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventComponent } from './views/event/event.component';
import { ListContactsComponent } from './views/list-contacts/list-contacts.component';
import { ContactComponent } from './views/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AuthenticationComponent,
    ToastComponent,
    EventComponent,
    ListContactsComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SpinnerModule,
    FullCalendarModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
