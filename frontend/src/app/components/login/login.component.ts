import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form:any = {
    email:null,
    password:null,
    role:null
  };

  loginValid = true;
  isSuccessful = false;
  isLoginFailed = false;
  errorMessage = '';

  isUserLoggedIn:boolean = false;

  constructor(
    private authService: AuthService,
  ) { }

  onSubmit() {
    const { email,password,role } = this.form;
    console.log(this.form);
    this.loginValid = true;
    this.authService
      .login(email,password,role)
      .subscribe(
        data => {
          this.authService.handleLoginSuccess();
          console.log("login working")
          this.authService.setToken(data.jwt);
          this.isLoginFailed = false;
          this.isSuccessful = true;

          this.authService.isUserLoggedIn.next(true);

        },
        err => {
          this.authService.isUserLoggedIn.next(false);
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      )
  }
}
