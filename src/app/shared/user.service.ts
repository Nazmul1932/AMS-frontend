import { Injectable } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http: HttpClient) {  }

  readonly BaseURL = 'http://localhost:62008/api'

  formModel = this.fb.group({

    UserName:['', Validators.required],
    Email:['', Validators.email],
    FullName:[''],
    Passwords: this.fb.group({
      Password:['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword:['', Validators.required],
    },{validator: this.comparePasswords}),
  })

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURL + '/ApplicationUser/Register', body);
  }

  login(formData) {
    return this.http.post(this.BaseURL + '/ApplicationUser/Login', formData);
  }

  getUserProfile() {
    var tokenHeader = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    return this.http.get(this.BaseURL + '/UserProfile', {headers: tokenHeader});
    // return this.http.get(this.BaseURL + '/UserProfile');
  }

  roleMatch(allowedRoles): boolean{
    var isMatch = false
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]))
    var userRole = payLoad.role
    allowedRoles.forEach(element=>{
      if(userRole == element){
        isMatch = true
        return false
      }
    });
    return isMatch
  }

}
