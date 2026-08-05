import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { OwnerService } from 'src/app/services/owner.service';
import { OwnerContactDialogComponent } from '../owner-contact-dialog/owner-contact-dialog.component';

@Component({
    selector: 'app-my-properties',
    templateUrl: './my-properties.component.html',
    styleUrls: ['./my-properties.component.css'],
    standalone: false
})
export class MyPropertiesComponent implements OnInit {

  properties:any[] = [];
  filterTerm!: string;
  roomTypeFilterTerm!:string;
  tenantTypeFilterTerm!:string;
  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const o_id = this.authService.getId().id;

    this.ownerService.getMyProperties(o_id)
      .subscribe(
        (data:any[]) => {
          this.properties = Object.values(data);
          console.log("Properties:",data,", this.properties:",this.properties);
        },
      )
  }

  navigate(id:string){
    this.router.navigate(['/propertyDetails', id ]);
  }

  openOwnerContactDialog(): void {
    this.dialog.open(OwnerContactDialogComponent);
  }
}
