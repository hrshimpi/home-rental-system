import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent implements OnInit{
  isMenuCollapsed = true;
  
  role:string = '';
  id:string = '';
  
  isUserLoggedIn!:boolean;

  constructor(
    private authService:AuthService,
    private cd: ChangeDetectorRef
  ){
    this.authService.isUserLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value;
    })
  }
  
  ngOnInit():void {
    const user = this.authService.getId();
    if(user){
      this.id = user.id;
      this.role = user.role;
    }

    // this.authService.userStatus.subscribe(
    //   (data:boolean) => {
    //     this.isUserLoggedIn = data;
    //   }
    // );
    this.cd.detectChanges();
  }

  logoutFromHeader() {
    // this.isULoggedIn = false;
    // this.authService.userStatus.emit(false);
    this.authService.isUserLoggedIn.next(true);
    this.authService.logout();
    window.location.reload();
  }
}
