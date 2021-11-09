import { CampaignsListComponent } from './campaigns/campaigns-list/campaigns-list.component';
import { ContactsListComponent } from './contacts/contacts-list/contacts-list.component';
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { RemindersComponent } from './reminders/reminders.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProfileComponent } from './security/profile/profile.component';
import { LoginComponent } from './security/login/login.component';
import { SignupComponent } from './security/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
  {path: 'contactsList', component: ContactsListComponent, canActivate: [AuthGuard]},
  {path: 'reminders', component: RemindersComponent, canActivate: [AuthGuard]},
  {path: 'campaigns', component: CampaignsListComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
