import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationComponent } from './views/authentication/authentication.component';
import { EventComponent } from './views/event/event.component';
import { ListContactsComponent } from './views/list-contacts/list-contacts.component';
import { ContactComponent } from './views/contact/contact.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthenticationComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-event/:id',
    component: EventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-event',
    component: EventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contacts',
    component: ListContactsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-contact/:id',
    component: ContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-contact',
    component: ContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
