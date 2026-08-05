import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AllPropertiesComponent } from './components/all-properties/all-properties.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AddPropertyComponent } from './components/add-property/add-property.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { DaysAgoPipe } from './pipes/days-ago.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { CommonModule } from '@angular/common';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MyChatsComponent } from './components/my-chats/my-chats.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { OwnerContactDialogComponent } from './components/owner-contact-dialog/owner-contact-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        AllPropertiesComponent,
        MyPropertiesComponent,
        ProfileComponent,
        PageNotFoundComponent,
        LoginComponent,
        SignUpComponent,
        AddPropertyComponent,
        PropertyDetailsComponent,
        DaysAgoPipe,
        FilterPipe,
        MyChatsComponent,
        LandingPageComponent,
        StarRatingComponent,
        OwnerContactDialogComponent,
    ],
    bootstrap: [AppComponent], imports: [FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        NgxFileDropModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatCardModule,
        MatChipsModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatRadioModule,
        MatListModule], providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
