import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPropertyComponent } from './components/add-property/add-property.component';
import { AllPropertiesComponent } from './components/all-properties/all-properties.component';
import { LoginComponent } from './components/login/login.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnerGuard } from './guards/owner.guard';
import { MyChatsComponent } from './components/my-chats/my-chats.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'signUp',
    component:SignUpComponent
  },
  {
    path:'',
    redirectTo:'allProperties',
    pathMatch:'full'
  },
  {
    path:'allProperties',
    component:AllPropertiesComponent,
  },
  {
    path:'landing-page',
    component:LandingPageComponent,
  },
  {
    path:'profile',
    component:ProfileComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'myProperties',
    component:MyPropertiesComponent,
    canActivate:[AuthGuard, OwnerGuard]
  },
  {
    path:'profile',
    component:ProfileComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'addProperty',
    component:AddPropertyComponent,
    canActivate:[AuthGuard,OwnerGuard]
  },
  {
    path:'propertyDetails/:id',
    component:PropertyDetailsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'my-chats/:uid',
    component:MyChatsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'**',
    component:PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
