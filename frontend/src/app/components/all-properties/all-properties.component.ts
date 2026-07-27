import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-all-properties',
  templateUrl: './all-properties.component.html',
  styleUrls: ['./all-properties.component.css']
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
    private modalService: NgbModal
  ) {}

  ownerID!:string;
  selectedItemID!:string;

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

  openModal(id: string): void {
    this.selectedItemID = id;
    // this.ownerID = this.properties.owner_id;
  }

}
