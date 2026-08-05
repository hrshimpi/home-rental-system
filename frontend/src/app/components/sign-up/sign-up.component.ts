import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    standalone: false
})
export class SignUpComponent {
  form:any = {
    uname:null,
    email:null,
    password:null,
    mobile:null,
    role:null
  };

  signupValid = true;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
  ) { }

  onSubmit() {
    const { email,password,uname,mobile,role } = this.form;
    console.log(this.form);
    this.signupValid = true;
    this.authService
      .signUp(email,password,uname,mobile,role)
      .subscribe(
        () => {
          this.authService.handleSignupSuccess();
          console.log("signUp working")
          this.isSignUpFailed = false;
          this.isSuccessful = true;
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      )
  }
}
