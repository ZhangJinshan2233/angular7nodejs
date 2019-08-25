import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchValidator } from '../_helpers/math-validator';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  base64Image:any
  signupForm: FormGroup;
  submitted = false;
  loading = false;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.createSignupForm();
  }

  createSignupForm() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      address1: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      dateOfBirth: ['', Validators.required],
      imageFile: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      comfirmPassword: ['', Validators.required]
    },
      {
        validator: MatchValidator("password", "comfirmPassword")
      }
    )
  }

  get f() { return this.signupForm.controls; };

  //convert image to base64
  onFileChanged(event) {
    let selectedFile = event.target.files[0]

    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.base64Image = myReader.result 
    }
    myReader.readAsDataURL(selectedFile);
  }
  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    let { firstName, lastName, userName, password, phoneNumber, address1, address2, country, city, postcode, dateOfBirth } = this.signupForm.value

    let imageData = this.base64Image.replace(/^data:image\/\w+;base64,/, "")

    let userInfo = {
      firstName,
      lastName,
      userName,
      password,
      phoneNumber,
      address1,
      country,
      city,
      postcode,
      address2,
      dateOfBirth,
      imageData
    }
    this.authService.register(userInfo).subscribe(success => {
      if (success) {
        this.router.navigate(['/login']);
      }
    })
  }
}
