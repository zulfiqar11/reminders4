import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup = new FormGroup({
    emailAddress: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    // if (this.form.valid) {
    //   let val = this.form.value;
    //   console.log(val);
    //   this.userService.signUp(val.emailaddress, val.password)
    //     .subscribe(user => {
    //       console.log("user created successfully", user);
    //       this.router.navigateByUrl("/login");
    //     })
    // }
  }
}
