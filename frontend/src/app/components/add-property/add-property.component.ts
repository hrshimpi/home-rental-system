import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxFileDropEntry,FileSystemFileEntry,FileSystemDirectoryEntry} from 'ngx-file-drop';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
    selector: 'app-add-property',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.css'],
    standalone: false
})
export class AddPropertyComponent {

  errorMessage = '';
  isAddCourseFailed:boolean = false;
  isSuccessful:boolean = false;
  myForm:FormGroup;
//--------------------------------------------
  constructor(
    private fb:FormBuilder,
    private ownerService: OwnerService,
    private router:Router,
  ){
    this.myForm = this.fb.group({
      propertyType:['',Validators.required],
      name:['',Validators.required],
      roomType:this.fb.array([],[Validators.required]),
      roomAmenities:this.fb.array([],[Validators.required]),
      rules:this.fb.array([],[Validators.required]),
      rent:['',Validators.required],
      deposite:['',Validators.required],
      address:['',Validators.required],
      landmark:['',Validators.required],
      tenantType:['',Validators.required],
      desc:['',Validators.required], 
      photos:this.fb.array([],[Validators.required])
    })
  }
  options: Array<any> = [
    { name: 'Single', value: 'Single' },
    { name: 'Double', value: 'Double' },
    { name: 'Three', value: 'Three' },
    { name: 'Four', value: 'Four' },
  ];

  roomAmenities: Array<any> = [
    { name:'Cupboard' , value:'Cupboard'},
    { name:'TV' , value:'TV'},
    { name:'Bedding' , value:'Bedding'},
    { name:'Geyser' , value:'Geyser'},
    { name:'AC' , value:'AC'},
    { name:'Attached Bathroom' , value:'AttachedBathroom'},
    { name:'Food Included', value:'FoodIncluded' },
    { name:'Laundry', value:'Laundry' },
    { name:'Room Cleaning', value:'RoomCleaning' },
    { name:'Warden Facility', value:'WardenFacility' },
    { name:'Lift', value:'Lift' },
    { name:'Refrigerator', value:'Refrigerator' },
    { name:'Wifi', value:'Wifi' },
    { name:'CookingAllowed', value:'CookingAllowed' },
    { name:'PowerBackup', value:'PowerBackup' },
    { name:'Parking', value:'Parking' },
  ]
  
  rules: Array<any> = [
    { name: 'No Smoking', value: 'NoSmoking' },
    { name: 'No Guardians Stay', value: 'NoGuardiansStay' },
    { name: 'No Girls Entry', value: 'NoGirlsEntry' },
    { name: 'No Drinking', value: 'NoDrinking' },
    { name: 'No Non-Veg', value: 'NoNonVeg' },
  ];
//--------------------------------------------
  currentStep = 1;
  nextStep() {
    this.currentStep++;
  }
  prevStep() {
    this.currentStep--;
  }

//--------------------------------------------
  onCheckboxChange(e: any ) {
    const checkArray: FormArray = this.myForm.get('roomType') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onCheckboxChangeR(e: any ) {
    const checkArray: FormArray = this.myForm.get('rules') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onCheckboxChangeA(e: any ) {
    const checkArray: FormArray = this.myForm.get('roomAmenities') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public files: NgxFileDropEntry[] = [];

  photosArray:any = [];

  public dropped(files: NgxFileDropEntry[]){
    this.files = files;
    for(const droppedFile of files) {
      
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.photosArray.push(file);
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  public fileOver(event:any){
    console.log("file over working",event);
  }
  public fileLeave(event:any){
    console.log("file leave working :",event);
  }

  onSubmit(){
    console.log("photos array",this.photosArray);
    this.myForm.value.photos = this.photosArray;
    console.log(this.myForm.value);

    this.ownerService.addProperty(
      this.myForm.value.name,
      this.myForm.value.propertType,
      this.myForm.value.rent,
      this.myForm.value.deposite,
      this.myForm.value.address,
      this.myForm.value.landmark,
      this.myForm.value.tenantType,
      this.myForm.value.desc,
      this.myForm.value.roomAmenities,
      this.myForm.value.roomType,
      this.myForm.value.rules,
      // this.myForm.value.photos
      this.photosArray
    ).subscribe(
      data => {
        this.router.navigate(['/myProperties']);
        console.log("property data: ", data);
      },
      err => {
        console.log("Error: ",err);
      }
    )
  }
}
