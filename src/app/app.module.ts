
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './shared/material/material.module';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SignupComponent } from './security/signup/signup.component';
import { LoginComponent } from './security/login/login.component';
import { ProfileComponent } from './security/profile/profile.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RemindersComponent } from './reminders/reminders.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/services/InMemoryData/InMemoryDBService';
import { environment } from '../environments/environment';
import { PageNotFoundComponent } from './navigation/page-not-found/page-not-found.component';
import { DatePipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ContactsListComponent } from './contacts/contacts-list/contacts-list.component';
import { ContactsFileListComponent } from './contacts/contacts-file-list/contacts-file-list.component';
import { ContactsNamesFileListComponent } from './contacts/contacts-names-file-list/contacts-names-file-list.component';
import { CampaignsListComponent } from './campaigns/campaigns-list/campaigns-list.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { ContactsUiComponent } from './contacts/contacts-ui/contacts-ui.component';
import { ButtonsComponent } from './shared/components/buttons/buttons.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    ProfileComponent,
    SidenavListComponent,
    ContactsComponent,
    RemindersComponent,
    PageNotFoundComponent,
    ContactsListComponent,
    ContactsFileListComponent,
    ContactsNamesFileListComponent,
    CampaignsListComponent,
    ContactsUiComponent,
    ButtonsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService),
    BrowserAnimationsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
