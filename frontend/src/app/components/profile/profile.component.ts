import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent implements OnInit{

  user:any;

  constructor(
    private authService: AuthService,
  ){}

  ngOnInit(): void {
    this.authService.getUserProfile()
      .subscribe(
        (data:any)=> {
          this.user = data;
          console.log(data);
          }
      );
  }

}
