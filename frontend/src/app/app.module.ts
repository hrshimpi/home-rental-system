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
import { NgbCollapseModule, NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { DaysAgoPipe } from './pipes/days-ago.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MyChatsComponent } from './components/my-chats/my-chats.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

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
    ],
    bootstrap: [AppComponent], imports: [FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        NgbRatingModule,
        NgbCollapseModule,
        CommonModule,
        ToastrModule.forRoot(),
        NgxFileDropModule], providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
