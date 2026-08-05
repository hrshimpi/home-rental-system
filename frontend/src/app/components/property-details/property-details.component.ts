import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { OwnerService } from 'src/app/services/owner.service';
import { TenantService } from 'src/app/services/tenant.service';

@Component({
    selector: 'app-property-details',
    templateUrl: './property-details.component.html',
    styleUrls: ['./property-details.component.css'],
    standalone: false
})



export class PropertyDetailsComponent implements OnInit{
  images = [
    {title: '', short: '', src: "https://www.hostelworld.com/blog/wp-content/uploads/2018/09/hostel-room-types-5.jpg"},
    {title: '', short: '', src: "https://www.hostelworld.com/blog/wp-content/uploads/2018/06/Hostel-room-types-Freehand-Los-Angeles.jpg"},
    {title: '', short: '', src: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zdGVsfGVufDB8fDB8fHww&w=1000&q=80"}
  ];
  currentImageIndex = 0;

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  property:any = {};
  reviews:any[] = [];

  reviewPosted: EventEmitter<void> = new EventEmitter<void>();
  // rev$: Observable<any>;

  avgRating:number = 0;
  public isCollapsed = true;
  public p_id:string ='';
  // reviewForm:FormGroup
  constructor(
    private ownerServices: OwnerService,
    private tenantService:TenantService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private router: Router,
    private fb:FormBuilder,
  ) {
    this.p_id = this.route.snapshot.params['id'];
    // this.rev$ = this.tenantService.getAllReviewByID(this.p_id);
  }

  userId!:string;
  ngOnInit(): void {
    this.p_id = this.route.snapshot.params['id'];
    this.userId = this.authService.getId().id;

    this.ownerServices.getPropertyDetails(this.p_id)
      .subscribe(
        (data:any[]) => {
          this.property = data[0];
          console.log("single property",this.property);
        }
      )

    this.tenantService.getAllReviewByID(this.p_id)
    .subscribe(
      (data:any[]) => {
        this.reviews = Object.values(data);
        console.log("reviews of this property", this.reviews)
      }
    )
    this.reviewPosted.subscribe(() => {
      this.tenantService.getAllReviewByID(this.p_id)
      .subscribe(
        (data:any[]) => {
          this.reviews = Object.values(data);
        }
      )
    })
  }

  messageOwner(ownerID:string): void {
    this.chatService.createNewChat(this.userId, ownerID).subscribe(
      (data:any) => {
        console.log("F chat created!");
        console.log(data);
        this.router.navigate(['my-chats/', this.userId])
      },
      (error) => {
        console.log("Error:",error);
      }
    )
  }


  //review form
  reviewForm = new FormGroup({
    // ctrl: new FormControl<number | null>(null, Validators.required),
    currentRate:new FormControl<number | null>(null,Validators.required) ,
    comment:new FormControl('', Validators.required)
  });
  // ctrl = this.currentRate;
  // ctrl = new FormControl<number | null>(null, Validators.required);
  onReviewSubmit(){
    console.warn(" form values:",this.reviewForm.value);  
    this.tenantService.addReview( 
      this.p_id,
      this.authService.getId().id,
      this.reviewForm.value.currentRate,
      this.reviewForm.value.comment
      ).subscribe(
        data => {
          console.log("Add review data",data);
          this.reviewPosted.emit();
          this.reviewForm.reset();
        }
      )
  }
}


