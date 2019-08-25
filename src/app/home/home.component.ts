import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../_services/home.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  profileForm: FormGroup
  currentUser: any = null
  isUpdate:boolean=false;
  submitted = false;
  constructor(private authService: AuthService,
    private router: Router,
    private homeService: HomeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createSignupForm();
    this.homeService.getProfile().subscribe(res => {
      this.currentUser =JSON.parse(res['user']) 
      this.profileForm.setValue({
        userName: this.currentUser.userName,
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        phoneNumber: this.currentUser.phoneNumber,
        country: this.currentUser.country,
        address1: this.currentUser.addresses[0].address,
        address2: this.currentUser.addresses[1].address,
        city: this.currentUser.city,
        postcode: this.currentUser.postcode,
        dateOfBirth: new Date(this.currentUser.dateOfBirth),
      })
    })
  }

  createSignupForm() {
    this.profileForm = this.formBuilder.group({
      firstName: [{value:''}, Validators.required],
      lastName: [{value:''}, Validators.required],
      userName: [{value:'',disabled:true}, [Validators.required, Validators.email]],
      phoneNumber: [{value:''}, [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      address1: [{value:''}, Validators.required],
      address2: [{value:''}],
      country: [{value:''}, Validators.required],
      city: [{value:''}, Validators.required],
      postcode: [{value:''}, [Validators.required, Validators.pattern(/^\d{6}$/)]],
      dateOfBirth: [{value:''}, Validators.required],

    })
  }

 
  get f() { return this.profileForm.controls; };

  toggleToUpdate(){
    
  this.isUpdate=!this.isUpdate
  }

  onSubmit(){
    this.homeService.updateProfile(this.profileForm.value).subscribe(success=>{
     this.isUpdate=false
    })
   
  }

  logout() {

    this.authService.logout().subscribe(success => {
      if (success) {
        this.router.navigate(['/login']);
      }
    })
  }
}
