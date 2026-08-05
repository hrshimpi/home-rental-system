import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
    selector: 'app-my-properties',
    templateUrl: './my-properties.component.html',
    styleUrls: ['./my-properties.component.css'],
    standalone: false
})
export class MyPropertiesComponent implements OnInit {

  properties:any[] = [];
  closeResult = '';
  filterTerm!: string;
  roomTypeFilterTerm!:string;
  tenantTypeFilterTerm!:string;
  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
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

  open(content:any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
