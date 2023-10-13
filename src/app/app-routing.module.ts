import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationComponent } from './views/authentication/authentication.component';
import { ProfileComponent } from './views/profile/profile.component';
import { EventComponent } from './views/event/event.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthenticationComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
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
