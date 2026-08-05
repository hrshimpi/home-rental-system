import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
    selector: 'app-all-properties',
    templateUrl: './all-properties.component.html',
    styleUrls: ['./all-properties.component.css'],
    standalone: false
})
export class AllPropertiesComponent implements OnInit{

  properties:any[] = [];
  filterTerm!: string;
  roomTypeFilterTerm!:string;
  tenantTypeFilterTerm!:string;
  userId:string = '';

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit():void {
    this.userId = this.authService.getId().id;

    this.ownerService.getAllProperties()
      .subscribe(
        (data:any[]) => {
          this.properties = Object.values(data);
          console.log("All Properties: ",data);
        }
      )
  }

  navigate(id:string){
    this.router.navigate(['/propertyDetails', id ]);
  }

}
